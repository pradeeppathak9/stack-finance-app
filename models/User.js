import pkg from 'mongoose';
const { Schema, model } = pkg;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
}, { timestamps: true });

const User = model('user', UserSchema);

export default User;