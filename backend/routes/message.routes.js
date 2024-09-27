import express from "express";
import { sendMessage } from "../controllers/message.controller.js"; // Adjusted the file path if needed

const router = express.Router();

// Define the POST route for sending messages
router.post("/send/:id", sendMessage);

export default router;
