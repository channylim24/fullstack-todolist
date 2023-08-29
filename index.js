require("dotenv").config();
const config = require("./src/config/index");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Todo = require("./models/Todo");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.send(todos);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching todos" });
  }
});

app.post("/todo/new", async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
    });

    await todo.save();

    res.status(201).json(todo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating a new todo" });
  }
});

app.delete("/todo/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Todo.findByIdAndDelete(id);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the todo" });
  }
});

app.put("/todo/complete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    todo.complete = !todo.complete;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the todo" });
  }
});

app.listen(3001, () => {
  console.log("server started on port 3001");
});
