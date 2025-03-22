const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json()); 
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const port = process.argv.length > 2 ? process.argv[2] : 4000;

let users = [];
const scores = [];

function isPasswordValid(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  }

app.post("/api/setup", async (req, res) => {
    const { username, password } = req.body;

    if (users.find((user) => user.username === username)) {
      return res.status(400).json({ msg: "User already exists" });
    }
  
    if (!isPasswordValid(password)) {
      return res.status(400).json({ msg: "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character." });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: uuid.v4(), username, password: hashedPassword };
    users.push(user);
  
    res.json({ msg: "User registered successfully" });
  });



app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  res.cookie("userId", user.id, { httpOnly: true });
  res.json({ msg: "Login successful" });
});


app.post("/api/nope", (req, res) => {
    const { correctCount, totalAttempts } = req.body;
    console.log(correctCount,totalAttempts)
    if (totalAttempts === 0) {
        return res.status(400).json({ msg: "No questions answered" });
    }
    scores.push({ correctCount, totalAttempts });
    const totalUsers = scores.length;
    const betterScores = scores.filter(score => score.correctCount < correctCount).length;
    const percentile = ((betterScores / totalUsers) * 100).toFixed(2);
    res.json({ percentile });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});