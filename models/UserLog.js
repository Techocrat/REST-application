import mongoose from "mongoose";
import moment from "moment-timezone";
const UserlogSchema = new mongoose.Schema({
   email: {
    type:String
   },
   loggedIn: {  
    type: String,
    default: moment().tz("Asia/Kolkata").format()
    }
});

export default mongoose.model("UserLog", UserlogSchema);
