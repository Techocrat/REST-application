import mongoose from "mongoose";
const UserlogSchema = new mongoose.Schema({
   email: {
    type:String
   },
   loggedIn: {  
    type: Date,
    default: Date.now()
    }
});

export default mongoose.model("UserLog", UserlogSchema);
