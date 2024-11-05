const Todo = require("../models/Todo");

// Add a new task
exports.addTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Todo({
      userId: req.user.id,
      title,
      description,
      completed: false,
    });

    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Todo.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { taskId, title, description } = req.body;
  try {
    let task = await Todo.findById(taskId);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Task not found" });
    }

    task.title = title || task.title;
    task.description = description || task.description;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Todo.findById(taskId);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await Todo.findByIdAndDelete(taskId);
    res.json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Toggle task completion status
exports.toggleTaskCompletion = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Todo.findById(taskId);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
