const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1) Create a Multer instance for storing files
function createMulterForMovie() {
  return multer({
    storage: multer.diskStorage({
      // Dynamically decide the folder based on req.params.id and file type
      destination: (req, file, cb) => {
        // 1) Read the movie ":id" from req.params
        const { id } = req.params; 
        if (!id) {
          return cb(new Error("No movie id in URL"));
        }

        // 2) Base folder: ../../contents/movies/<id>
        const baseFolder = path.join(__dirname, "../contents/movies", String(id));
        if (!fs.existsSync(baseFolder)) {
          fs.mkdirSync(baseFolder, { recursive: true });
        }

        // 3) Decide the subfolder using either an extra field or the file.fieldname:
        //    The client can optionally send a field like "filmType", "trailerType", or "imageType"
        const subFolder = req.body[`${file.fieldname}Type`] || file.fieldname;
        const finalFolder = path.join(baseFolder, subFolder);
        if (!fs.existsSync(finalFolder)) {
          fs.mkdirSync(finalFolder, { recursive: true });
        }

        console.log(`Saving ${file.fieldname} file to: ${finalFolder}`);
        cb(null, finalFolder);
      },

      filename: (req, file, cb) => {
        // Use the file’s original name by default.
        // Optionally, allow an override from a field like "filmName", "trailerName", or "imageName"
        const customName = req.body[`${file.fieldname}Name`];
        const finalName = customName ? customName : file.originalname;
        cb(null, finalName);
      },
    }),
    // Optional: large file size limit (example: 2 GB)
    limits: { fileSize: 2 * 1024 * 1024 * 1024 }, 
  });
}

// 2) Final route handler that runs after Multer saves the files
function handleFileUpload(req, res) {
  try {
    // Multer has already saved the files to disk in the correct subfolders.
    // The files are available in req.files (if using .fields) or req.file (if using .single).
    console.log("Uploaded files:", req.files);
    
    // (Optional) You could update your database or perform additional logic here.

    return res.status(201).json({
      message: "Files uploaded successfully via Multer!",
      movieId: req.params.id,
    });
  } catch (err) {
    console.error("Error in handleFileUpload:", err);
    return res.status(500).send("Server error");
  }
}

module.exports = {
  createMulterForMovie,
  handleFileUpload
};
