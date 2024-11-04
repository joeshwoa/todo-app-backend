// routes/todoRoutes.js

const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, todoController.addTask);
router.get("/all", authMiddleware, todoController.getTasks);
router.put("/update", authMiddleware, todoController.updateTask);
router.delete("/delete/:taskId", authMiddleware, todoController.deleteTask);
router.put("/toggle/:taskId", authMiddleware, todoController.toggleTaskCompletion);

module.exports = router;
