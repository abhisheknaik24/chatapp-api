import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import Message from '../models/messages.js';
import Conversation from '../models/conversations.js';

const sendMessage = async (req, res) => {
  if (req.method === 'POST') {
    const { userID, receiverUserID, content } = req.body;

    const token = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.TOKEN_KEY
    );

    if ((userID, receiverUserID, content, token)) {
      let conversation = await Conversation.findOneAndUpdate(
        { participants: { $in: [userID, receiverUserID] } },
        { $push: { participants: [userID, receiverUserID] } },
        { new: true, upsert: true }
      );

      let user = await User.findOne({ _id: userID, isActive: true });

      let message = new Message({
        conversation: conversation,
        type: 'text',
        sender: user,
        content: content,
      });

      await message.save();

      let chats = await Conversation.find({ participants: userID }).populate(
        'participants'
      );

      res.status(200).json({
        success: true,
        message: 'Chat added successfully!',
        data: { chats: chats },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Request body is missing!',
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Request method is not allowed!',
    });
  }
};

export default { sendMessage };
