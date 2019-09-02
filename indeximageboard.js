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

//Boilerplate code added from notes
app.use(express.static("./public"));

app.get("/showImages", (req, res) => {
    // console.log("THIS IS MY LOG", req);
    db.getImages()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("err", err);
        });
});


app.get("/showImagesNew", (req, res) => {
    // console.log("THIS IS MY LOG", req);
    db.getImagesNew()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("err", err);
        });
});

app.get("/showMoreImages/:id", (req, res) => {
    console.log("Logging req.params.id in /showMoreImages", req.params.id);
    db.getMoreImages(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("Err in showMoreImages", err);
        });
});

// //DELETE THIS WHEN REDUNDENT
// app.get("/showMoreImages", (req, res) => {
//     // console.log("THIS IS MY LOG", req);
//     // db.getMoreImages(req.params.id)
//     db.getMoreImages()
//         .then(data => {
//             res.json(data);
//         })
//         .catch(err => {
//             console.log("ERROR IN /showMoreImages", err);
//         });
// });

app.get("/showModalImage/:id", (req, res) => {

    db.getSingleImage(req.params.id)
        .then(data => {
            console.log(data);
            res.json(data);
            // console.log("THIS IS MY LOG", req.params.id[0]);
        })
        .catch(err => {
            console.log("err", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("Logging req.file in /upload in index.js: ", req.file);
    // const { filename } = req.file;
    //You need to pass the four things below, url, title, username, description into
    const url = config.s3Url + req.file.filename;
    const { title, username, description } = req.body;
    // console.log("logging req.body in index.js", req.body);
    // console.log("Logging url in /upload in index.js: ", url);

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

app.post("/comment/:id", (req, res) => {
    // console.log("LOGGING /COMMENT IN POST");
    // console.log("Logging req.body /COMMENT IN POST: ", req.body);
    // console.log("Logging req.params /COMMENT IN POST: ", req.params);
    db.addComment(req.body.comment, req.body.username, req.params.id)
        .then(data => {
            res.json(data.rows[0]);
            // console.log("LOGGING RES IN APP.POST /COMMENTS: ", res);
        })
        .catch(err => {
            console.log("ERROR IN APP.POST /COMMENTS: ", err);
        });
});

app.get("/showComment/:id", (req, res) => {
    db.getComment(req.params.id)
        .then(data => {
            // console.log(data);
            res.json(data);
        })
        .catch(err => {
            console.log("err", err);
        });
});

app.listen(8080, () => console.log("Image board server is running..."));
