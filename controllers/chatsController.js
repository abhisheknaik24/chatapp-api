import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import Message from '../models/messages.js';

const getChats = async (req, res) => {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Authorization token is missing!',
      });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

    if (decodedToken.data.email) {
      let user = await User.findOne({
        email: decodedToken.data.email,
        isActive: true,
      });

      const chats = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: user._id }, { receiver: user._id }],
            isActive: true,
          },
        },
        {
          $sort: { updatedAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: [{ $eq: ['$sender', user._id] }, '$receiver', '$sender'],
            },
            message: { $first: '$content' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            email: '$user.email',
            name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
            message: 1,
          },
        },
        {
          $limit: 10,
        },
      ]);

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
