import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";

export const update = async (req, res) => {
  try {
    // update details
    // console.log("Request user", req.user);
    const { firstName, middleName, lastName, email, department } = req.body;
    const userId = req.params.id;

    // check if user exists
    const user = await User.findOne({ _id: userId, role: "user" });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    // to be updated field values
    let setQuery = {};
    // old field values
    let fieldOldValue = {};

    console.log("existing user: ", user);

    if (firstName) {
      setQuery.firstName = firstName;
      console.log("user.firstname: ", user.firstName);
      fieldOldValue.firstName = req.user.firstName;
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
    const activityLog = new ActivityLog({
      userId: req.user._id,
      username: req.user.firstName,
      fieldNewValue: setQuery,
      fieldOldValue: fieldOldValue,
    });
    await activityLog.save();
    console.log("Activity log", activityLog);
    User.updateOne(
      { _id: userId, role: "user" },
      { $set: setQuery },
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "User updated successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const view = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId, role: "user" }).select({
      firstName: 1,
      middleName: 1,
      lastName: 1,
      email: 1,
      department: 1,
    });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
