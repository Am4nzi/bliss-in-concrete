const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/planets", (req, res) => {
    let planets = [
        {
            name: "Pluto",
            colour: "grey/yellow"
        },
        {
            name: "Venus",
            colour: "orange"
        },
        {
            name: "Mars",
            colour: "red"
        }
    ];
    console.log("I hit the planets route");
    res.json(planets);
});

app.listen(8080, () => console.log("Image board server is running..."));
