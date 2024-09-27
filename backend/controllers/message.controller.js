import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
//import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
	  const { message } = req.body;
	  const { id: receiverId } = req.params;
  
	  // Check if req.user is populated correctly
	  const senderId = req.user ? req.user._id : null;
	  console.log("Sender ID:", senderId);
	  console.log("Receiver ID:", receiverId);
  
	  // Validate user ID
	  if (!senderId || !receiverId) {
		return res.status(400).json({ error: "Invalid sender or receiver ID" });
	  }
  
	  // Find or create a conversation between the sender and receiver
	  let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	  });
	  console.log("Conversation:", conversation);
  
	  if (!conversation) {
		conversation = await Conversation.create({
		  participants: [senderId, receiverId],
		});
	  }
  
	  // Create a new message
	  const newMessage = new Message({
		senderId,
		receiverId,
		message,
	  });
  
	  if (newMessage) {
		conversation.messages.push(newMessage._id);
	  }
  
	  // Save conversation and message in parallel
	  await Promise.all([conversation.save(), newMessage.save()]);
	  console.log("Message saved:", newMessage);
  
	  // Send response back with the newly created message
	  res.status(201).json(newMessage);
	} catch (error) {
	  // Log full error
	  console.error("Error in sendMessage controller:", error);
	  res.status(500).json({ error: "Internal server error" });
	}
  };
  

/*export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};*/