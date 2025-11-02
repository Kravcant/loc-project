import express from "express";

const app = express();

const PORT = 3100;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile(`${import.meta.dirname}/views/home.html`);
});

app.get("/edit", (req, res) => {
	res.sendFile(`${import.meta.dirname}/views/edit.html`);
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
