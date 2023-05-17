import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import Contact from '../models/contacts.js';

const getContacts = async (req, res) => {
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

      let contacts = await Contact.find({
        user: user._id,
        isActive: true,
      })
        .populate({ path: 'contacts', select: 'firstName lastName email' })
        .select('contacts')
        .lean();

      contacts = contacts.flatMap((contact) => {
        return contact.contacts.map((i) => ({
          _id: i._id,
          name: `${i.firstName} ${i.lastName}`,
          email: i.email,
        }));
      });

      res.status(200).json({
        success: true,
        message: 'Contacts fetched successfully!',
        data: { contacts: contacts },
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

const addContact = async (req, res) => {
  if (req.method === 'POST') {
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
      let user = await User.findOne({
        email: decodedToken.data.email,
        isActive: true,
      });

      let contactUser = await User.findOne({ email: email, isActive: true });

      let contact = await Contact.findOne({
        user: user,
        contacts: { $in: contactUser._id },
        isActive: true,
      });

      if (!contact) {
        await Contact.findOneAndUpdate(
          { user: user },
          { $push: { contacts: contactUser._id } },
          { new: true, upsert: true }
        );

        res.status(200).json({
          success: true,
          message: 'Contact added successfully!',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Contact already exist!',
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

export default { getContacts, addContact };
