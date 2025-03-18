import multer from "multer";
import path from "path";
import fs from "fs";

const imagesDir = path.join(path.resolve(), "images");
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);  
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");  
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); 
        cb(null, uniqueSuffix);
    }
});
export const upload = multer({ storage });

