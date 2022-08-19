const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Mongodb & Mongoose

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wikiDB");
}

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
  });

const Article = mongoose.model("Article", articleSchema);

//Routes for all articles

app.route("/articles")

.get(async function (req, res) {
  const allArticles = await Article.find({});
  res.send(allArticles);
})

.post(async function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  await newArticle.save();
})

.delete(async function (req, res) {
  const deletedArticles = await Article.deleteMany({});
  res.send(deletedArticles);
});

//Routes for specific articles

app.route("/articles/:articleTitle")

.get(async function (req, res) {
  const getFilter = { title: req.params.articleTitle };
  const getDocs = await Article.findOne(getFilter);
  res.send(getDocs);
})

.put(async function (req, res) {
  const putFilter = { title: req.params.articleTitle };
  const putUpdate = { title: req.body.title, content: req.body.content };
  const putDoc = await Article.findOneAndReplace(putFilter, putUpdate, { new: true });
  res.send(putDoc);
})

.patch(async function (req, res) {
  const patchFilter = { title: req.params.articleTitle };
  const patchUpdate = { title: req.body.title, content: req.body.content };
  const patchDoc = await Article.findOneAndUpdate(patchFilter, patchUpdate, { new: true });
  res.send(patchDoc);
})

.delete(async function (req, res) {
  const deleteFilter = { title: req.params.articleTitle };
  const deletedDoc = await Article.findOneAndDelete(deleteFilter);
  res.send(deletedDoc);
})

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});