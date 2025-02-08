const contentService = require('../services/content')
const tokenVerifier = require('../TokenVerifier');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken');

const key = process.env.SECRET;

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
					fs.mkdirSync(finalFolder, { recursive: true });
				}

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

				const baseFolder = path.join(__dirname, "../contents/users");
				cb(null, baseFolder);
			},
			filename: (req, file, cb) => {
				const customName = req.params.name + path.extname(file.originalname);
				const finalName = customName ? customName : file.originalname;
				cb(null, finalName);
			},
		}),
		limits: { fileSize: 5 * 1024 * 1024 },
	});
}

function handleFileUpload(req, res) {
	try {
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
		return res.status(500).json({ error: (err || "Internal Server Error") });
	}
}

const getMovieFiles = async (req, res) => {
	try {
		const type = req.query.type;

		if (!type) {
			return res.status(400).json({ error: "Type wasn't specified" });
		}

		// Custom token verification for video streaming
		if (type === 'trailer' || type === 'film') {
			const token = req.query.token;
			if (!token) {
				return res.status(401).json({ error: "Token is missing"});
			}
	
			try {
				jwt.verify(token, key);
			} catch (err) {
				return res.status(401).json({ error: 'Token is invalid' });
			}
		}

		const result = await contentService.getMovieFiles(req.params.id, type, req.headers.range);

		if (type === 'image') {
			const { file, contentType } = result;

			res.setHeader('Content-Type', contentType);
			return res.status(200).send(file);
		}

		// Video streaming
		const { head, file } = result;

		res.writeHead(206, head);
		file.pipe(res);
	} catch (err) {
		return res.status(500).json({ error: (err || "Internal Server Error") });
	}
}

const getUserFiles = async (req, res) => {
	try {

	} catch (err) {
		return res.status(500).json({ error: (err || "Internal Server Error") });
	}
}

module.exports = { createMulterForMovie, handleFileUpload, createMulterForUser, getMovieFiles, getUserFiles };