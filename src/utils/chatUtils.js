const hasAccessToChat = (req, chat_id) => {
    const userId = req.user?.id;
    const shopId = req.shop?.id;

    if (!chat_id || (!userId && !shopId)) {
        return false;
    }

    // chat_id có định dạng userId-shopId
    const [chatUserId, chatShopId] = chat_id.split('-').map(Number);

    if (userId && chatUserId === userId) {
        return true;
    }

    if (shopId && chatShopId === shopId) {
        return true;
    }

    return false;
};

module.exports = { hasAccessToChat };