var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = () => {
	return db
		.query(
			`SELECT * FROM images
        ORDER BY created_at DESC
        LIMIT 24`
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.getMoreImages = lastId => {
	return db
		.query(
			`SELECT *, (
                SELECT id
                FROM images
                ORDER BY id ASC
                LIMIT 1
            )AS "lowestId" FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 24`,
			[lastId]
		)
		.then(({ rows }) => rows);
};

exports.addImages = (title, username, description, url) => {
	return db.query(
		`INSERT INTO images (title, username, description, url) VALUES
         ($1, $2, $3, $4)
         RETURNING *`,
		[title, username, description, url]
	);
};

exports.getSingleImage = imageId => {
	return db.query(
		`SELECT url, title, description FROM images
        WHERE id = $1`,
		[imageId]
	);
};

exports.addComment = (comment, username, id) => {
	return db.query(
		`INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
		[comment, username, id]
	);
};

exports.getComment = imageId => {
	return db.query(
		`SELECT comment, username FROM comments
        WHERE image_id = $1
        ORDER BY created_at DESC`,
		[imageId]
	);
};
