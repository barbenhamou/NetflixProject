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

function createMulterForUser() {
	return multer({
	  storage: multer.diskStorage({
		destination: (req, file, cb) => {
		  const { name } = req.params;
		  if (!name) {
			return cb(new Error("No username in URL"));
		  }
  
		  const baseFolder = path.join(__dirname, "../contents/users", String(name));
		  console.log(`Saving profile picture file to: ${baseFolder}`);
		  cb(null, baseFolder);
		},
		filename: (req, file, cb) => {
		  const customName = req.body.profilePictureName;
		  const finalName = customName ? customName : file.originalname;
		  cb(null, finalName);
		},
	  }),
	  limits: { fileSize: 5 * 1024 * 1024 },
	});
  }

function handleFileUpload(req, res) {
	try {
		console.log("Uploaded files:", req.files);

		if (req.params.id) {
			return res.status(201).json({
				message: "Files uploaded successfully via Multer!",
				movieId: req.params.id,
			});
		}
		
		if (req.params.name) {
			return res.status(201).json({
			  message: "User profile picture uploaded successfully via Multer!",
			  username: req.params.name,
			});
		}

	} catch (err) {
		return res.status(500).json({"error": (err || "Internal Server Error") });
	}
}

module.exports = {createMulterForMovie,	handleFileUpload};
