const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createMulterForMovie() {
	return multer({
		storage: multer.diskStorage({
			destination: (req, file, cb) => {
				const { id } = req.params; 
				if (!id) {
					return cb(new Error("No movie id in URL"));
				}

				const baseFolder = path.join(__dirname, "../contents/movies", String(id));
				if (!fs.existsSync(baseFolder)) {
					fs.mkdirSync(baseFolder, { recursive: true });
				}

				const subFolder = req.body[`${file.fieldname}Type`] || file.fieldname;
				const finalFolder = path.join(baseFolder, subFolder);
				if (!fs.existsSync(finalFolder)) {
					s.mkdirSync(finalFolder, { recursive: true });
				}

				console.log(`Saving ${file.fieldname} file to: ${finalFolder}`);
				cb(null, finalFolder);
			},

			filename: (req, file, cb) => {
				const customName = req.body[`${file.fieldname}Name`];
				const finalName = customName ? customName : file.originalname;
				cb(null, finalName);
			},
			}),
		limits: { fileSize: 2 * 1024 * 1024 * 1024 }, 
	});
}

function handleFileUpload(req, res) {
	try {
		console.log("Uploaded files:", req.files);

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
