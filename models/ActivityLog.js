import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
});

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  userName: {
    type: String,
  },
  fieldOldValue: { type: UserSchema },
  fieldNewValue: { type: UserSchema },
});
export default mongoose.model("ActivityLog", ActivityLogSchema);
