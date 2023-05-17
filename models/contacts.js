import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        unique: true,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model('Contacts', contactSchema);
