// import express from "express";
// import { 
//     getCurrentUser, 
//     updateAssistant, 
//     getAssistants, 
//     getAssistantById,
//     deleteAssistant, 
//     askToAssistant
// } from "../controllers/user.controllers.js";
// import isAuth from "../middlewares/isAuth.js";
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from 'url';

// const userRouter = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../uploads/'));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only images are allowed'));
//     }
//   }
// });

// userRouter.get("/current", isAuth, getCurrentUser);
// userRouter.get("/assistants", isAuth, getAssistants);
// userRouter.get("/assistant/:assistantId", isAuth, getAssistantById);
// userRouter.delete("/assistant/:assistantId", isAuth, deleteAssistant);
// userRouter.post("/upload", isAuth, upload.single("assistantImage"), updateAssistant);
// userRouter.post("/asktoassistant",isAuth, askToAssistant);

// export default userRouter;


import express from "express";
import { 
    getCurrentUser, 
    updateAssistant, 
    getAssistants, 
    getAssistantById,
    deleteAssistant, 
    askToAssistant
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const userRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/assistants", isAuth, getAssistants);
userRouter.get("/assistant/:assistantId", isAuth, getAssistantById);
userRouter.delete("/assistant/:assistantId", isAuth, deleteAssistant);
userRouter.post("/upload", isAuth, upload.single("assistantImage"), updateAssistant);
userRouter.post("/asktoassistant", isAuth, askToAssistant);

export default userRouter;