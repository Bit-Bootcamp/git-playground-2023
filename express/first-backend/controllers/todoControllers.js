import path from "path";
import fs from "fs";

const __dirname = path.resolve();
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/db.json`));

export const getAllTodo = (req, res) => {
  res.json({ status: "success", data: data.todos });
};

export const getTodoById = (req, res) => {
  const id = parseInt(req.params.id);

  const todo = data.todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({ status: "error", message: "todo not found" });
  }

  res.status(200).json({ status: "success", data: todo });
};

export const addTodo = async (req, res) => {
  const id = data.todos[data.todos.length - 1].id + 1;
  const todo = { ...req.body, id };
  data.todos.push(todo);
  await fs.promises.writeFile(
    `${__dirname}/data/db.json`,
    JSON.stringify(data)
  );
  res.status(201).json({ status: "success", data: todo });
};

export const updateTodo = async (req, res) => {
  const id = parseInt(req.params.id);
  let updated = false;

  const todos = data.todos.map((todo) => {
    if (todo.id === id) {
      updated = true;
      return { ...req.body, id };
    }
    return todo;
  });

  data.todos = todos;
  if (updated) {
    await fs.promises.writeFile(
      `${__dirname}/data/db.json`,
      JSON.stringify(data)
    );

    res.status(200).json({ status: "success", data: { ...req.body, id } });
  }
  res.status(404).json({ status: "error", message: "todo not found" });
};
