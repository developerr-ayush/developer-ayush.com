import multer from "multer";
import path from "path";

// Multer config
export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(null, false); // Fix: Pass null as the first argument
      return;
    }
    cb(null, true);
  },
});
