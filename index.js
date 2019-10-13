const express = require("express");
const app = express();
const db = require("./utils/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");

const diskStorage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, __dirname + "/uploads");
	},
	filename: function(req, file, callback) {
		uidSafe(24).then(function(uid) {
			callback(null, uid + path.extname(file.originalname));
		});
	}
});

const uploader = multer({
	storage: diskStorage,
	limits: {
		fileSize: 2097152
	}
});

app.use(express.json());

app.use(express.static("./public"));

app.get("/showImages", (req, res) => {
	db.getImages()
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.log("Error in /showImages", err);
		});
});


app.get("/showMoreImages/:id", (req, res) => {
	db.getMoreImages(req.params.id)
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.log("Error in showMoreImages", err);
		});
});

app.get("/showModalImage/:id", (req, res) => {
	db.getSingleImage(req.params.id)
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.log("Error in /showModalImage/:id", err);
		});
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
	const url = config.s3Url + req.file.filename;
	const { title, username, description } = req.body;

	if (req.file) {
		db.addImages(title, username, description, url)
			.then(data => {
				res.json(data.rows[0]);
			})
			.catch(err => {
				console.log(
					"Error in addImages in index.js",
					err
				);
			});
	} else {
		res.json({
			success: false
		});
	}
});

app.post("/comment/:id", (req, res) => {
	db.addComment(req.body.comment, req.body.username, req.params.id)
		.then(data => {
			res.json(data.rows[0]);
		})
		.catch(err => {
			console.log("Error in addComment db query: ", err);
		});
});

app.get("/showComment/:id", (req, res) => {
	db.getComment(req.params.id)
		.then(data => {
			res.json(data.rows);
		})
		.catch(err => {
			console.log("Error in /showComment/:id", err);
		});
});

app.listen(8080, () => console.log("Image board server is running..."));
