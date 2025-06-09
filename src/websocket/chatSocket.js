const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const chatService = require('../services/chatService');


function setupSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Không có token xác thực'));
        }

        try {
            const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
            if (userDecoded) {
                socket.user = { id: userDecoded.user_id || userDecoded.id, type: 'user' };
                return next();
            }

            const shopDecoded = jwt.verify(token, process.env.JWT_SHOP_SECRET || process.env.JWT_SECRET);
            if (shopDecoded) {
                socket.user = { id: shopDecoded.shop_id || shopDecoded.id, type: 'shop' };
                return next();
            }

            return next(new Error('Token không hợp lệ'));
        } catch (error) {
            console.error('Lỗi xác thực socket:', error);
            return next(new Error('Token không hợp lệ hoặc hết hạn'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket kết nối: ${socket.id}`);

        socket.on('auth', (token) => {
            try {
                const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
                if (userDecoded) {
                    socket.user = { id: userDecoded.user_id || userDecoded.id, type: 'user' };
                    socket.emit('auth_success', { message: 'Xác thực thành công', userId: socket.user.id });
                    return;
                }

                const shopDecoded = jwt.verify(token, process.env.JWT_SHOP_SECRET || process.env.JWT_SECRET);
                if (shopDecoded) {
                    socket.user = { id: shopDecoded.shop_id || shopDecoded.id, type: 'shop' };
                    socket.emit('auth_success', { message: 'Xác thực thành công', userId: socket.user.id });
                    return;
                }

                socket.emit('auth_error', 'Token không hợp lệ');
            } catch (error) {
                console.error('Lỗi xác thực socket:', error);
                socket.emit('auth_error', 'Lỗi xác thực');
            }
        });

        socket.on('send_message', async (data) => {
            try {
                const { receiver_id, message } = data;
                if (!receiver_id || !message) {
                    socket.emit('error', 'Thiếu thông tin người nhận hoặc nội dung tin nhắn');
                    return;
                }

                const senderId = socket.user.id;
                const senderType = socket.user.type;
                const receiverType = senderType === 'user' ? 'shop' : 'user';

                const chatId = senderType === 'user' ? `${senderId}-${receiver_id}` : `${receiver_id}-${senderId}`;

                console.log(`Tạo tin nhắn với chatId: ${chatId}`);
                const newMessage = await chatService.createMessage({
                    chat_id: chatId,
                    sender_id: senderId,
                    sender_type: senderType,
                    receiver_id,
                    receiver_type: receiverType,
                    message,
                });


                socket.emit('message_sent', newMessage);

                const receiverSocket = Array.from(io.sockets.sockets.values()).find(
                    (s) => s.user && s.user.id === receiver_id && s.user.type === receiverType
                );

                if (receiverSocket) {
                    receiverSocket.emit('new_message', newMessage);
                }
            } catch (error) {
                console.error('Lỗi gửi tin nhắn:', error);
                socket.emit('error', error.message || 'Lỗi gửi tin nhắn');
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket ngắt kết nối: ${socket.id}`);
        });
    });

    return io;
}

module.exports = { setupSocketServer };