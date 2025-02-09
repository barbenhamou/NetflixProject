const movieService = require('./movie');
const userService = require('./user');
const errorClass = require("../ErrorHandling");
const fs = require('fs');
const path = require('path');

const getMovieFiles = async (id, type, range) => {
    try {
        const movie = await movieService.getMovieById(id);
        if (!movie) {
            throw { statusCode: 404, message: 'Movie not found' };
        }

        // Map type to the corresponding file field
        const typeToFileMap = {
            image: movie.image,
            film: movie.film,
            trailer: movie.trailer
        };

        const fileName = typeToFileMap[type];
        if (!fileName) {
            throw { statusCode: 400, message: 'Invalid file type' };
        }

        const filePath = path.join(__dirname, '../contents/movies', id, type, fileName);

        if (type === 'image') {
            const file = fs.readFileSync(filePath);
            // Get the extension name
            const contentType = `image/${path.extname(fileName).slice(1)}`;
            return { file, contentType };
        }

        const fileSize = fs.statSync(filePath).size;

        // Extract the range requested by the browser
        const parts = range.substring(6).split('-');
        const start = parseInt(parts[0]);
        const chunk_size = 10 * (1024 ** 2); // 10MB
        const end = Math.min(start + chunk_size, fileSize - 1);
        const file = fs.createReadStream(filePath, { start, end });

        // Stream requested chunk
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': (end - start) + 1,
            'Content-Type': 'video/mp4',
        };
        return { head, file };
    } catch (err) {
        errorClass.filterError(err);
    }
}

const getUserFiles = async (id) => {
    try {
        const user = await userService.getUserById(id);
        const ext = path.extname(user.picture);
        const filename = user.username + ext;
        const filePath = path.join(__dirname, '../contents/users', filename);
        const file = fs.readFileSync(filePath);
        const contentType = `image/${ext.slice(1)}`;
        return { file, contentType };
    } catch (err) {
        console.log("here3 " + err)
        errorClass.filterError(err);
    }
}

module.exports = { getMovieFiles, getUserFiles };