import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";

export const updateAdmin = async (req, res) => {
  try {
    console.log("UPDATING ADMIN");
    // update details
    // console.log("Request user", req.user);
    const { firstName, middleName, lastName, email, department } = req.body;
    const userId = req.params.id;

    // check if user exists
    const user = await User.findOne({ _id: userId, role: "admin" });

    if (!user) {
      return res.status(400).json({ error: "Admin not found!" });
    }
    // to be updated field values
    let setQuery = {};
    // old field values
    let fieldOldValue = {};

    console.log("existing user: ", user);

    if (firstName) {
      setQuery.firstName = firstName;
      console.log("user.firstname: ", user.firstName);
      fieldOldValue.firstName = user.firstName;
    }
    if (middleName) {
      setQuery.middleName = middleName;
      fieldOldValue.middleName = user.middleName;
    }
    if (lastName) {
      setQuery.lastName = lastName;
      fieldOldValue.lastName = user.lastName;
    }
    if (email) {
      setQuery.email = email;
      fieldOldValue.email = user.email;
    }
    if (department) {
      setQuery.department = department;
      fieldOldValue.department = user.department;
    }

    console.log("Set query", setQuery);
    console.log("Field old value", fieldOldValue);
    // req.user - is the user updating other profile.
    // save in activity log
    await User.updateOne({ _id: userId, role: "admin" }, { $set: setQuery });

    const activityLog = await ActivityLog.create({
      userId: user._id,
      username: req.user.firstName,
      fieldNewValue: setQuery,
      fieldOldValue: fieldOldValue,
    });
    console.log("Activity log", activityLog);

    return res.status(200).json({ message: "Admin updated successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const viewAdmins = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("USER ID ", userId);
    const user = await User.findOne({ _id: userId, role: "admin" }).select({
      firstName: 1,
      middleName: 1,
      lastName: 1,
      email: 1,
      department: 1,
      role: 1,
    });

    if (!user) {
      return res.status(400).json({ error: "Admin not found!" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
