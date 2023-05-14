import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import Message from '../models/messages.js';
import Conversation from '../models/conversations.js';

const getChats = async (req, res) => {
  if (req.method === 'GET') {
    const token = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.TOKEN_KEY
    );

    console.log(token)

    if (token) {
      let chats = await Conversation.find({ participants: userID }).populate(
        'participants'
      );

      res.status(200).json({
        success: true,
        message: 'Chats fetched successfully!',
        data: { chats: chats },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Request query is missing!',
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Request method is not allowed!',
    });
  }
};

export default { getChats };
