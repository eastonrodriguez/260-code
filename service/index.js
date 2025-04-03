const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

const port = process.argv.length > 2 ? process.argv[2] : 4000;

const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
let db;
const client = new MongoClient(url);
client.connect()
  .then(() => {
    db = client.db('startup');
    console.log("Connected to MongoDB and using the database: startup");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

function isPasswordValid(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  }

app.post("/api/setup", async (req, res) => {
    const { username, password } = req.body;
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    if (!isPasswordValid(password)) {
      return res.status(400).json({
        msg: "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ username, password: hashedPassword });
  
    res.json({ msg: "User registered successfully" });
  });



app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  res.cookie("userId", user._id, { httpOnly: true });
  res.json({ msg: "Login successful" });
});


app.post("/api/nope", async (req, res) => {
  const { correctCount, totalAttempts } = req.body;

  if (totalAttempts === 0) {
    return res.status(400).json({ msg: "No questions answered" });
  }

  try {
    const scoresCollection = db.collection('scores');
    await scoresCollection.insertOne({ correctCount, totalAttempts });

    const totalUsers = await scoresCollection.countDocuments();
    const betterScores = await scoresCollection.countDocuments({ correctCount: { $lt: correctCount } });
    const percentile = ((betterScores / totalUsers) * 100).toFixed(2);

    res.json({ percentile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
const { quizScoreServer } = require('./peerProxy.js');
quizScoreServer(httpService);