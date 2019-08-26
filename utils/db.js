var spicedPg = require("spiced-pg");

var db = spicedPg(
    "postgres:postgres:postgres@localhost:5432/imageboard"
);


exports.getImages = () => {
    return db.query(
        `SELECT url, title, description FROM images`)
        .then(({ rows }) => {
            return rows;
        });
};
