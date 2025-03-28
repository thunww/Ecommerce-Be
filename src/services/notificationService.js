const { Notification } = require('../models');

class NotificationService {
    async getNotifications(user_id) {
        return await Notification.findAll({
            where: { user_id },
            order: [['created_at', 'DESC']]
        });
    }

    async markAsRead(notification_id) {
        const notification = await Notification.findByPk(notification_id);
        if (!notification) {
            throw new Error('Không tìm thấy thông báo');
        }

        notification.is_read = true;
        await notification.save();
    }

    async markAllAsRead(user_id) {
        await Notification.update(
            { is_read: true },
            { where: { user_id } }
        );
    }

    async createNotification(user_id, title, content, type) {
        return await Notification.create({
            user_id,
            title,
            content,
            type,
            is_read: false
        });
    }
}

module.exports = new NotificationService(); 