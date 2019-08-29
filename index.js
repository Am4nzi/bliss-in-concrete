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

app.use(express.static("./public"));

app.get("/begin", (req, res) => {
    db.getImages()
        .then(data => {
            console.log("data in begin", data);
            res.json(data);
        })
        .catch(err => {
            console.log("err", err);
        });
});

app.get("/showModalImage/:id", (req, res) => {
    db.getSingleImage(req.params.id)
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log("err", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("Logging req.file in /upload in index.js: ", req.file);
    // const { filename } = req.file;
    //You need to pass the four things below, url, title, username, description into
    const url = config.s3Url + req.file.filename;
    const { title, username, description } = req.body;
    console.log("logging req.body in index.js", req.body);
    console.log("Logging url in /upload in index.js: ", url);

    if (req.file) {
        db.addImages(title, username, description, url)
            .then(data => {
                console.log("title in index.js", title);
                res.json(data.rows[0]);
            })
            .catch(err => {
                console.log("ERROR in addImages in index.js", err);
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, () => console.log("Image board server is running..."));
