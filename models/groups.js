import { Schema, model } from 'mongoose';

const groupSchema = new Schema(
  {
    name: { type: String, maxLength: 255, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'Users', required: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model('Groups', groupSchema);
