const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('assets'));
app.use(express.static('public'));

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "/index.html"))
});

app.get("/all-articles", async (req, res) => {
  const client = await MongoClient.connect(process.env.MONGO_URL);
  const dbName = process.env.MONGO_DBNAME;
  const db = client.db(dbName);

  const fieldCollection = db.collection("field");

  const allFields = await fieldCollection.find().toArray();

  res.json(allFields)
});

app.get("/article/:_id", async (req, res) => {
  const {_id} = req.params;

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const dbName = process.env.MONGO_DBNAME;
  const db = client.db(dbName);

  const fieldCollection = db.collection("field");

  const airtcle = await fieldCollection.findOne({ _id: new ObjectId(_id) });

  res.json(airtcle)
});

app.post("/save", async (req, res) => {
  const field = req.body;

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const dbName = process.env.MONGO_DBNAME;
  const db = client.db(dbName);

  const fieldCollection = db.collection("field");

  await fieldCollection.insertOne({ field });

  res.status(300).send();
});

app.get("/edit/:_id", async (req, res) => {
  const {_id} = req.params;

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const dbName = process.env.MONGO_DBNAME;
  const db = client.db(dbName);

  const fieldCollection = db.collection("field");

  const airtcle = await fieldCollection.findOne({ _id: new ObjectId(_id) });

  res.json(airtcle);
})

app.post("/edit", async (req, res) => {
  const {_id, article} = req.body;

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const dbName = process.env.MONGO_DBNAME;
  const db = client.db(dbName);

  const fieldCollection = db.collection("field");

  await fieldCollection.findOneAndUpdate({ _id: new ObjectId(_id) }, {$set: {field: article}});

  res.status(300).send();
})

app.delete("/delete", async (req, res) => {
  const {_id} = req.body;

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const dbName = process.env.MONGO_DBNAME;
  const db = client.db(dbName);

  const fieldCollection = db.collection("field");

  await fieldCollection.deleteOne({ _id: new ObjectId(_id) });

  res.status(300).send();
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is lisning on port ${port}...`);
});
