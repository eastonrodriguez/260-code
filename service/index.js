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


app.post("/setup", async (req, res) => {
  const { username, password } = req.body;

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuid.v4(), username, password: hashedPassword };
  users.push(user);

  res.json({ msg: "User registered successfully" });
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  res.cookie("userId", user.id, { httpOnly: true });
  res.json({ msg: "Login successful" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});