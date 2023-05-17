import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
  {
    type: {
      type: String,
      maxLength: 255,
      enum: ['text', 'image', 'audio', 'video'],
      required: true,
    },
    content: { type: String, maxLength: 255, required: true },
    seenAt: { type: Date },
    sender: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model('Messages', messageSchema);
