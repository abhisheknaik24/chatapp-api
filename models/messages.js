import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversations',
      required: true,
    },
    type: {
      type: String,
      maxLength: 255,
      enum: ['text', 'image', 'audio', 'video'],
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    content: { type: String, maxLength: 255, required: true },
    seenAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model('Messages', messageSchema);
