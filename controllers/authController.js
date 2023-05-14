import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';

const login = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if ((email, password)) {
      let user = await User.findOne({ email: email, isActive: true });

      let check_password = await bcrypt.compare(password, user.password);

      if (user && check_password) {
        let token = jwt.sign(
          {
            data: { userID: user._id, email: email },
          },
          process.env.TOKEN_KEY,
          { expiresIn: '1h' }
        );

        await User.updateOne({ email: email }, { token: token });

        res.status(200).json({
          success: true,
          message: 'User login successfully!',
          data: { token: token },
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'User not found!',
        });
      }
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

const register = async (req, res) => {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password } = req.body;

    if ((firstName, lastName, email, password)) {
      let user_check = await User.exists({ email: email });

      if (!user_check) {
        let hashPassword = await bcrypt.hash(password, 10);

        let user = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashPassword,
        });

        await user.save();

        res.status(200).json({
          success: true,
          message: 'User register successfully!',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'User already exist!',
        });
      }
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

export default { login, register };
