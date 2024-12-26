const UserModel = require("../Models/UserModel");

// Get USer ONe Month Before
const GetUses = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  let allUsers = [];
  const users = await UserModel.find({
    monthEndDate: {
      $lte: new Date(),
    },
  }).select(
    "userId username package packageRate lastMonthDue balancedAmount amountPaid staticIPAmmount staticIPAddress active monthEndDate"
  );
  allUsers = users;
  return allUsers;
};

// UPdate User Data For checking Month
const UpdateUserData = () => {
  GetUses().then((users) => {
    console.log("Users:", users);
    users.forEach((user) => {
      let lastMonthDue = 0;
      let amountPaid = 0;
      let otherAmount = 0;

      if (user.balancedAmount > 0) {
        lastMonthDue = user.balancedAmount;
      } else {
        amountPaid = user.balancedAmount;
      }

      UserModel.findOneAndUpdate(
        {
          userId: user.userId,
        },
        {
          lastMonthDue: lastMonthDue,
          balancedAmount: amountPaid,
          otherAmount: otherAmount,
        },
        (err, doc) => {
          if (err) console.log(err);
          console.log('====================================');
          console.log(doc);
          console.log('====================================');
        }
      );
    });
  });
};

module.exports = UpdateUserData;