const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getNotifications(req.user.user_id);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.id);
        res.json({ message: 'Đã đánh dấu thông báo đã đọc' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.user_id);
        res.json({ message: 'Đã đánh dấu tất cả thông báo đã đọc' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 