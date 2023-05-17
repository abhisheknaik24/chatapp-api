import express from 'express';
import contactsController from '../controllers/contactsController.js';

const router = express.Router();

router.get('/getContacts', contactsController.getContacts);

router.post('/addContact', contactsController.addContact);

export default router;
