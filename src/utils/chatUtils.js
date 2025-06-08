function hasAccessToChat(req, chatId) {
    console.log('Checking access for chatId:', chatId);
    console.log('req.user:', req.user);
    console.log('req.shop:', req.shop);
    if (!chatId || typeof chatId !== 'string') {
        return false;
    }

    const parts = chatId.split('-');
    if (parts.length !== 2) {
        return false;
    }

    try {
        const userId = parseInt(parts[0]);
        const shopId = parseInt(parts[1]);

        if (isNaN(userId) || isNaN(shopId)) {
            return false;
        }

        if (req.user && req.user.id === userId) {
            return true;
        }

        if (req.shop && req.shop.id === shopId) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error in hasAccessToChat:', error);
        return false;
    }
}

module.exports = {
    hasAccessToChat
};
