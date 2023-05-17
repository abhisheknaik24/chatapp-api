import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';

const login = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (email && password) {
      try {
        let user = await User.findOne({ email: email, isActive: true });

        if (user) {
          let checkPassword = await bcrypt.compare(password, user.password);

          if (checkPassword) {
            let token = jwt.sign(
              { data: { email: email } },
              process.env.TOKEN_KEY,
              { expiresIn: '24h' }
            );

            user.token = token;
            await user.save();

            res.status(200).json({
              success: true,
              message: 'User logged in successfully!',
              data: { token: token },
            });
          } else {
            res.status(401).json({
              success: false,
              message: 'Invalid password!',
            });
          }
        } else {
          res.status(404).json({
            success: false,
            message: 'User not found!',
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'An error occurred while processing the request!',
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Email or password is missing!',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: 'Method Not Allowed!',
    });
  }
};

const register = async (req, res) => {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password } = req.body;

    if (firstName && lastName && email && password) {
      try {
        let userExists = await User.exists({ email: email });

        if (!userExists) {
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
            message: 'User registered successfully!',
          });
        } else {
          res.status(409).json({
            success: false,
            message: 'User already exists!',
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'An error occurred while processing the request!',
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'One or more fields are missing!',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: 'Method Not Allowed!',
    });
  }
};

export default { login, register };
