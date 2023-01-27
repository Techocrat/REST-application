import mongoose from "mongoose";

const UpdateSchema = new mongoose.Schema({
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
  fieldOldValue: { type: UpdateSchema },
  fieldNewValue: { type: UpdateSchema },
});
export default mongoose.model("ActivityLog", ActivityLogSchema);
