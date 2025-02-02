// routes/files.js
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file');
const tokenVerifier = require('../TokenVerifier');

// 1) Create a Multer middleware from createMulterForMovie()
//    and specify the fields you expect: film, trailer, image
const uploadMulter = fileController.createMulterForMovie().fields([
  { name: 'film', maxCount: 1 },
  { name: 'trailer', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

// 2) POST /api/files/:id/files
//    - First run the Multer middleware to handle file uploads
//    - Then run the fileController.handleFileUpload to respond
router.post('/:id/files', 
  uploadMulter,                
  fileController.handleFileUpload,
  tokenVerifier.tokenValidation(true)
);

module.exports = router;
