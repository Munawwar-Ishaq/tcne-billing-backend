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
    let monthEndDate = new Date(user.monthEndDate).setMonth(
      new Date(user.monthEndDate).getMonth() + 1
    );

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
        monthEndDate: monthEndDate,
      },
      { new: true }
    );
    console.log("====================================");
    console.log("Update user success : ", UpdatedUser);
    console.log("====================================");

    let monthEndDate =
      user.monthEndDate ||
      new Date(user.createdAt).setMonth(
        new Date(user.createdAt).getMonth() + 1
      );
    const statementHistory = new UserStatmentModel({
      userID: user._id.toString(),
      statementHistory: [
        {
          type: "userAdd",
          date: new Date(),
          staticIPAmount: user.staticIPAmmount,
          packageAmount: user.packageRate,
          otherAmount: user.otherAmount,
          subTotalAmount: subTotalAmmount,
          discount: user.discount,
          totalAmount: totalAmmount,
          amountPaid: user.amountPaid,
          balance: totalAmmount - parseFloat(user.amountPaid || 0),
          packagename: user.package,
          ipAddress: user.staticIPAddress,
          describe: user.decribeOtherAmount,
        },
      ],
      toDate: new Date(),
      endDate: monthEndDate,
    });

    await statementHistory.save();
  } catch (e) {
    console.log("====================================");
    console.log("Error Wiling Update User", e);
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
