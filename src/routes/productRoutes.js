const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {handleUploadProductImage,handleGetProductImages,handleDeleteProductImage} = require("../controllers/productController");

router.post("/upload", upload.single("image"), handleUploadProductImage);
router.get("/:product_id/images", handleGetProductImages);
router.delete("/image/:image_id", handleDeleteProductImage);

module.exports = router;
