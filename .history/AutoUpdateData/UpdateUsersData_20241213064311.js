const UserModel = require("../Models/UserModel");

// Get USer ONe Month Before
const GetUses = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  let allUsers = [];
  const users = await UserModel.find({
    month: {
      $lt: oneMonthAgo,
    },
  }).select(
    "userId username package packageRate lastMonthDue amountPaid staticIPAmmount staticIPAddress active"
  );
  allUsers = users;
  return allUsers;
};

// UPdate User Data For checking Month
const UpdateUserData = () => {
  GetUses().then((users) => {
    console.log("Users:", users);
    users.forEach((user) => {
      //     UserModel.findByIdAndUpdate(
      //       user._id,
      //       {
      //         lastMonthDue: user.amountPaid,
      //         balancedAmount: user.totalAmount - user.amountPaid,
      //       },
      //       { new: true },
      //       (err, doc) => {
      //         if (err) console.log(err);
      //       }
      //     );
    });
  });
};

module.exports = UpdateUserData;