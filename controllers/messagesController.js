import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import Message from '../models/messages.js';

const getMessages = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Authorization token is missing!',
        });
      }

      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

      const { email } = req.body;

      if (decodedToken.data.email && email) {
        const user = await User.findOne({
          email: decodedToken.data.email,
          isActive: true,
        });

        const contactUser = await User.findOne({
          email: email,
          isActive: true,
        });

        const messages = await Message.find({
          $and: [
            {
              $or: [{ sender: user._id }, { receiver: user._id }],
            },
            {
              $or: [{ sender: contactUser._id }, { receiver: contactUser._id }],
            },
            { isActive: true },
          ],
        })
          .populate('sender', 'firstName lastName email')
          .populate('receiver', 'firstName lastName email')
          .select('content sender receiver createdAt')
          .lean();

        res.status(200).json({
          success: true,
          message: 'Messages fetched successfully!',
          data: { messages: messages },
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Request body is missing!',
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: String(error) });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Request method is not allowed!',
    });
  }
};

const sendMessage = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Authorization token is missing!',
        });
      }

      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

      const { email, content } = req.body;

      if (decodedToken.data.email && email && content) {
        const user = await User.findOne({
          email: decodedToken.data.email,
          isActive: true,
        });

        const contactUser = await User.findOne({
          email: email,
          isActive: true,
        });

        const message = new Message({
          type: 'text',
          content: content,
          sender: user._id,
          receiver: contactUser._id,
        });

        await message.save();

        res.status(200).json({
          success: true,
          message: 'Message sent successfully!',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Request body is missing!',
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: String(error) });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Request method is not allowed!',
    });
  }
};

export default { getMessages, sendMessage };
