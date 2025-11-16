import express from "express";

const app = express();

const PORT = 3100;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/edit", (req, res) => {
	res.render("edit");
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
