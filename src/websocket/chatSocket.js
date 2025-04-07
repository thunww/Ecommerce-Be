const WebSocket = require('ws');
const chatService = require('../services/chatService');
const jwt = require('../config/jwt');

// Lưu trữ kết nối WebSocket của người dùng và shop
const userConnections = new Map(); // user_id -> ws
const shopConnections = new Map(); // shop_id -> ws

const setupWebSocket = (server) => {
    // Tạo WebSocket server
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws, req) => {
        let userId = null;
        let shopId = null;
        let tokenType = null; // 'user' hoặc 'shop'

        // Xử lý khi nhận được tin nhắn từ client
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);

                // Xử lý authentication khi kết nối
                if (data.type === 'auth') {
                    const decoded = verifyToken(data.token);
                    if (!decoded) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Xác thực không hợp lệ'
                        }));
                        return;
                    }

                    // Xác định loại token (user hoặc shop)
                    if (decoded.role === 'user') {
                        userId = decoded.id;
                        tokenType = 'user';
                        userConnections.set(userId, ws);
                        console.log(`Người dùng ${userId} đã kết nối`);
                    } else if (decoded.role === 'shop') {
                        shopId = decoded.id;
                        tokenType = 'shop';
                        shopConnections.set(shopId, ws);
                        console.log(`Shop ${shopId} đã kết nối`);
                    }

                    // Thông báo kết nối thành công
                    ws.send(JSON.stringify({
                        type: 'auth_success',
                        data: {
                            id: tokenType === 'user' ? userId : shopId,
                            role: tokenType
                        }
                    }));
                    return;
                }

                // Kiểm tra xác thực trước khi xử lý các loại tin nhắn khác
                if (!userId && !shopId) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Vui lòng xác thực trước khi gửi tin nhắn'
                    }));
                    return;
                }

                // Xử lý gửi tin nhắn
                if (data.type === 'message') {
                    const { receiver_id, message: content } = data;

                    if (!receiver_id || !content) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Thiếu thông tin người nhận hoặc nội dung tin nhắn'
                        }));
                        return;
                    }

                    let senderId, senderType, receiverId, receiverType;

                    if (tokenType === 'user') {
                        senderId = userId;
                        senderType = 'user';
                        receiverId = receiver_id;
                        receiverType = 'shop';
                    } else {
                        senderId = shopId;
                        senderType = 'shop';
                        receiverId = receiver_id;
                        receiverType = 'user';
                    }

                    // Lưu tin nhắn vào database
                    const newMessage = await chatService.createMessage(
                        senderId,
                        senderType,
                        receiverId,
                        receiverType,
                        content
                    );

                    // Gửi tin nhắn đến người nhận nếu họ đang online
                    const receiverWs = receiverType === 'user'
                        ? userConnections.get(parseInt(receiverId))
                        : shopConnections.get(parseInt(receiverId));

                    if (receiverWs) {
                        receiverWs.send(JSON.stringify({
                            type: 'new_message',
                            data: newMessage
                        }));
                    }

                    // Xác nhận gửi tin nhắn thành công
                    ws.send(JSON.stringify({
                        type: 'message_sent',
                        data: newMessage
                    }));
                }
            } catch (error) {
                console.error('Lỗi xử lý tin nhắn WebSocket:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Lỗi xử lý tin nhắn'
                }));
            }
        });

        // Xử lý khi client ngắt kết nối
        ws.on('close', () => {
            if (userId) {
                userConnections.delete(userId);
                console.log(`Người dùng ${userId} đã ngắt kết nối`);
            } else if (shopId) {
                shopConnections.delete(shopId);
                console.log(`Shop ${shopId} đã ngắt kết nối`);
            }
        });
    });

    return wss;
};

// Xác thực token
const verifyToken = (token) => {
    // Thử xác thực như người dùng
    const userDecoded = jwt.verifyToken(token);
    if (userDecoded) {
        return { ...userDecoded, role: 'user' };
    }

    // Nếu không phải token người dùng, không làm gì cả vì không cần hỗ trợ shop
    return null;
};

module.exports = { setupWebSocket }; 