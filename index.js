import express from 'express';
import './config.js';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import chatsRoutes from './routes/chatsRoutes.js';
import messagesRoutes from './routes/messagesRoutes.js';
import contactsRoutes from './routes/contactsRoutes.js';

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: process.env.CLIENT_METHODS,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use('/api/auth', authRoutes);

app.use('/api/chats', chatsRoutes);

app.use('/api/messages', messagesRoutes);

app.use('/api/contacts', contactsRoutes);

(async () => {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    app.listen(port);
  } catch (error) {
    process.exit(1);
  }
})();
