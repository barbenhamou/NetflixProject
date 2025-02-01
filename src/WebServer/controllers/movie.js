const movieService = require('../services/movie');
const fs = require("fs");
const path = require("path");
// Only show relevant info
const presentMovie = async (movie) => {
    try {
        // Turn the category IDs into actual category documents
        await movie.populate('categories');

        return {
            id: movie._id,
            title: movie.title,
            categories: movie.categories.map(category => category.name),
            lengthMinutes: movie.lengthMinutes,
            releaseYear: movie.releaseYear,
            cast: movie.cast,
            image: movie.image,
            trailer: movie.trailer,
            film: movie.film,
            description: movie.description
        };
    } catch (err) {
        throw {statusCode: 500, message: 'Error displaying movie'};
    }
};

const getMovies = async (req, res) => {
    try {
        const moviesLists = await movieService.getMovies(req.token);
        res.json(
            await Promise.all(
                moviesLists.map((moviesList) =>
                    Promise.all(moviesList.map((movie) => presentMovie(movie)))
                )
            )
        );
        
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const createMovie = async (req, res) => {
    try {
        const movie = await movieService.createMovie(req.body);
        
        res.status(201).set('Location', `/api/movies/${movie._id}`).end();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const getMovie = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);

        res.json(await presentMovie(movie));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const replaceMovie = async (req, res) => {
    try {
        if (!await movieService.replaceMovie(req.params.id, req.body))
            throw {statusCode: 404, message: 'Movie could not be replced'};
    
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        if (!(await movieService.deleteMovie(req.params.id)))
            throw {statusCode: 404, message: 'Movie could not be deleted'};
    
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const recommendMovies = async (req, res) => {
    try {
        const recommendation = await movieService.recommendMovies(req.token, req.params.id);
        res.json(await Promise.all(recommendation.map((movie) => presentMovie(movie))));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
    
};

const watchMovie = async (req, res) => {
    try {
        await movieService.watchMovie(req.token, req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const searchInMovies = async (req, res) => {
    try {
        const movies = await movieService.searchInMovies(req.params.query);
        res.json(await Promise.all(movies.map((movie) => presentMovie(movie))));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const getMovieFiles = async (req, res) => {
    try {
        const result = await movieService.getMovieFiles(req.params.id, req.query.type, req.headers.range);

        if (req.query.type === 'image') {
            const { file, contentType } = result;

            res.setHeader('Content-Type', contentType);
            res.status(200).send(file);
            return;
        }

        // Video streaming
        const { head, file } = result;

        res.writeHead(206, head);
        file.pipe(res);
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
}




// Example controller function
// Assumes you POST to: /api/movies/:movieId/files
const uploadMovieFiles =async (req, res) => {
  console.log("here:");
  try {
    // 1) Confirm the request is multipart/form-data
    const contentType = req.headers["content-type"] || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return res.status(400).send("Expected multipart/form-data");
    }
    console.log("here:");
   

    // 2) Extract the boundary from headers: e.g., 
    //    Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryxyz
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      return res.status(400).send("No multipart boundary found");
    }
    const boundary = "--" + boundaryMatch[1];

    // We read the entire request body into memory (not ideal for huge files!)
    let chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      const all = Buffer.concat(chunks);

      // 3) Split by boundary
      //    The body typically ends with `--<boundary>--`
      const parts = all
        .split(Buffer.from(boundary))
        .slice(1, -1); 
        // slice(1, -1) removes the empty parts before/after the final boundary

      // We'll track each file in an array
      let files = [];

      // 4) Parse each part
      parts.forEach((part) => {
        // Separate headers from body by finding "\r\n\r\n"
        const headerDelimiter = "\r\n\r\n";
        const partString = part.toString("binary"); // for header parsing
        const headerIndex = partString.indexOf(headerDelimiter);
        if (headerIndex === -1) return; // invalid part, skip

        // raw headers
        const rawHeaders = partString.substring(0, headerIndex);
        // file body (as binary)
        const bodyBuffer = part.slice(headerIndex + headerDelimiter.length);

        // Check the Content-Disposition header
        // e.g. Content-Disposition: form-data; name="film"; filename="myMovie.mp4"
        const dispositionMatch = rawHeaders.match(
          /Content-Disposition:.*name="([^"]+)"(?:; filename="([^"]+)")?/i
        );
        if (!dispositionMatch) return; // skip if malformed
        const fieldName = dispositionMatch[1];  // "film" / "image" / "trailer"
        const filename = dispositionMatch[2];   // e.g. "myMovie.mp4"

        // If there's no filename, it's likely a text field (skip)
        if (!filename) return;

        // We'll store this part's data for later
        files.push({
          fieldName,   // "film", "image", "trailer"
          filename,    // actual filename from user
          data: bodyBuffer
        });
      });

      // 5) We get `:movieId` from req.params
      const { id } = req.params;
      if (!id) {
        return res.status(400).send("Missing movieId in URL");
      }
      console.log("Movie ID:", id);
      // 6) Build the path: ../../movies/<movieId>
      //    Adjust if your structure is different
      const baseFolder = path.join(__dirname, "../../movies", String(id));
      if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder, { recursive: true });
      }

      // Create the 3 subfolders: Movie, Trailer, Image
      const movieFolder   = path.join(baseFolder, "Movie");
      const trailerFolder = path.join(baseFolder, "Trailer");
      const imageFolder   = path.join(baseFolder, "Image");

      [movieFolder, trailerFolder, imageFolder].forEach((folder) => {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
      });

      // 7) Save each file into the correct subfolder based on `fieldName`
      files.forEach((fileObj) => {
        let destinationFolder;

        // If fieldName is "film", save into "Movie" subfolder
        if (fileObj.fieldName === "film") {
          destinationFolder = movieFolder;
        }
        // If fieldName is "trailer", save into "Trailer" subfolder
        else if (fileObj.fieldName === "trailer") {
          destinationFolder = trailerFolder;
        }
        // If fieldName is "image", save into "Image" subfolder
        else if (fileObj.fieldName === "image") {
          destinationFolder = imageFolder;
        }
        else {
          // If there's some other fieldName, skip or handle
          return;
        }

        const finalFilePath = path.join(destinationFolder, fileObj.filename);
        fs.writeFileSync(finalFilePath, fileObj.data);
      });

      // 8) Done
      return res.status(201).json({
        message: "Files saved successfully!",
        id,
      });
    });

    req.on("error", (err) => {
      console.error("Request error:", err);
      return res.status(500).send("Server error");
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
};

module.exports = {
    getMovies, createMovie, getMovie, replaceMovie, deleteMovie, recommendMovies, watchMovie, searchInMovies, presentMovie, getMovieFiles,uploadMovieFiles,
};