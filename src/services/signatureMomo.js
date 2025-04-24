const crypto = require('crypto');

// ⚠️ Dữ liệu phải khớp tuyệt đối với JSON bạn gửi trong Postman
const rawSignature = "accessKey=F8BBA842ECF85&amount=50000&extraData=&ipnUrl=https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b&orderId=order1682200000000&orderInfo=pay with MoMo&partnerCode=MOMO&redirectUrl=https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b&requestId=MOMO1682200000000&requestType=captureWallet";

const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'; // thay bằng đúng secret của bạn

const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

console.log("✅ Signature tạo ra:", signature);