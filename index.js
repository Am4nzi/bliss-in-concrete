const express = require("express");
const app = express();
const db = require("./utils/db");

app.use(express.static("./public"));

app.get("/begin", (req, res) => {
    db.getImages().then(data => {
        res.json(data);
    }).catch(err => {
        console.log("err", err);
    });
});


app.listen(8080, () => console.log("Image board server is running..."));
