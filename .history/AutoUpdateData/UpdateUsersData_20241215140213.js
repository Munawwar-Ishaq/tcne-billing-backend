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

const updateUser = async (user) => {
  try {
    let lastMonthDue = 0;
    let amountPaid = 0;
    let otherAmount = 0;

    if (user.balancedAmount > 0) {
      lastMonthDue = user.balancedAmount;
    } else {
      amountPaid = user.balancedAmount;
    }

    let UpdatedUser = await UserModel.findOneAndUpdate(
      {
        userId: user.userId,
      },
      {
        lastMonthDue: lastMonthDue,
        balancedAmount: amountPaid,
        otherAmount: otherAmount,
        monthEndDate : monthEndDate,
      },
      { new: true }
    );
    console.log("====================================");
    console.log("Update user success : ", UpdatedUser);
    console.log("====================================");



  } catch (e) {
    console.log("====================================");
    console.log("Error Wiling Update USer");
    console.log("====================================");
  }
};

// UPdate User Data For checking Month
const UpdateUserData = async () => {
  GetUses().then((users) => {
    console.log("Users:", users);
    users.forEach((user) => {
      updateUser(user);
    });
  });
};

module.exports = UpdateUserData;
