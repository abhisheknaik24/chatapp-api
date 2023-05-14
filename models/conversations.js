import { Schema, model } from 'mongoose';

const conversationSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model('Conversations', conversationSchema);
