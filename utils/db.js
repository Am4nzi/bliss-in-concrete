var spicedPg = require("spiced-pg");

var db = spicedPg(
    "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = () => {
    return db.query(
        `SELECT * FROM images
        ORDER BY created_at DESC`)
        .then(({ rows }) => {
            return rows;
        });
};

//GET 24 AT A TIME
//WHAT IS THE LOWEST ID OF THE DATABASE -> THIS WILL HELP TO KNOW WHEN TO HIDE STOP BUTTON. IF FIRST IMAGE HAS ID OF 1, WHEN YOU HAVE AN IMAGE WITH THE ID OF 1, STOP SHOWING...
//DON'T HARD CARD IMAGE IDs b/c PEOPLE MIGHT WANT TO DELETE IMAGES. YOU SHOULD DO A SEPERATE QUERY INSTEAD*
// exports.getImages24 = () => {
//     return db.query(
//         `SELECT id,
//          url, title, description FROM images
//         ORDER BY created_at DESC
//         WHERE id < $1
//         LIMIT 24`)
//         .then(({ rows }) => {
//             return rows;
//         });
// };

// *
// SELECT id AS "lowestId"
// FROM IMAGES
// ORDER by id ASC
// LIMIT 1

exports.addImages = (title, username, description, url) => {
    return db.query(
        `INSERT INTO images (title, username, description, url) VALUES
         ($1, $2, $3, $4)
         RETURNING *`,
        [title, username, description, url]
    );
};

exports.getSingleImage = (imageId) => {
    return db.query(
        `SELECT url, title, description FROM images
        WHERE id = $1`, [imageId]);
};
