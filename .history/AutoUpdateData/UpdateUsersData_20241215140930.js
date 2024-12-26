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

    let subTotalAmmount =
      parseFloat(UpdatedUser.packageRate || 0) +
      parseFloat(UpdatedUser.otherAmount || 0) +
      parseFloat(UpdatedUser.staticIPAmmount || 0) +
      parseFloat(UpdatedUser.lastMonthDue || 0);

    let totalAmmount =
      parseFloat(UpdatedUser.packageRate || 0) +
      parseFloat(UpdatedUser.lastMonthDue || 0) +
      parseFloat(UpdatedUser.staticIPAmmount || 0) +
      parseFloat(UpdatedUser.otherAmount || 0) -
      parseFloat(UpdatedUser.discount || 0);

    const statementHistory = new UserStatmentModel({
      userID: UpdatedUser._id.toString(),
      statementHistory: [
        {
          type: "userAdd",
          date: new Date(),
          staticIPAmount: UpdatedUser.staticIPAmmount,
          packageAmount: UpdatedUser.packageRate,
          otherAmount: 0,
          subTotalAmount: subTotalAmmount,
          discount: UpdatedUser.discount,
          totalAmount: totalAmmount,
          amountPaid: UpdatedUser.amountPaid,
          balance: totalAmmount - parseFloat(UpdatedUser.amountPaid || 0),
          packagename: UpdatedUser.package,
          ipAddress: UpdatedUser.staticIPAddress,
          describe: [],
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
