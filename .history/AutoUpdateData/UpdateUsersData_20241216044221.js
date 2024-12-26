const PaymentModel = require("../Models/PaymentModel");
const UserModel = require("../Models/UserModel");
const UserStatmentModel = require("../Models/UserStatmentModel");

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
    let lastMonthDue = "";
    let amountPaid = "";
    let otherAmount = "";
    let monthEndDate = new Date(user.monthEndDate).setMonth(
      new Date(user.monthEndDate).getMonth() + 1
    );

    if (user.balancedAmount > 0) {
      lastMonthDue = String(user.balancedAmount);
    } else {
      amountPaid = String(user.balancedAmount);
    }

    let UpdatedUser = await UserModel.findOneAndUpdate(
      {
        userId: user.userId,
      },
      {
        $set: {
          lastMonthDue: lastMonthDue,
          amountPaid: amountPaid,
          otherAmount: otherAmount,
          monthEndDate: monthEndDate,
          // packageRate : 
        },
      },
      { new: true }
    );

    let staticIPAmmount = parseFloat(UpdatedUser.staticIPAmmount || 0);
    let packageRate = parseFloat(UpdatedUser.packageRate || 0);
    let otherAmountVal = parseFloat(UpdatedUser.otherAmount || 0);
    let lastMonthDueVal = parseFloat(UpdatedUser.lastMonthDue || 0);
    let discount = parseFloat(UpdatedUser.discount || 0);

    console.log("====================================");
    console.log("Update user success : ", UpdatedUser);
    console.log("====================================");

    console.log("====================================");
    console.log("staticIPAmmount:", staticIPAmmount);
    console.log("packageRate:", packageRate);
    console.log("otherAmountVal:", otherAmountVal);
    console.log("lastMonthDueVal:", lastMonthDueVal);
    console.log("discount:", discount);
    console.log("====================================");

    let subTotalAmount =
      staticIPAmmount + lastMonthDueVal + packageRate + otherAmountVal;
    let totalAmount = subTotalAmount - discount;

    console.log("Calculated subTotalAmount:", subTotalAmount);
    console.log("Calculated totalAmount (after discount):", totalAmount);

    const statementHistory = new UserStatmentModel({
      userID: UpdatedUser._id.toString(),
      statementHistory: [
        {
          type: "userAdd",
          date: new Date(),
          staticIPAmount: UpdatedUser.staticIPAmmount,
          packageAmount: UpdatedUser.packageRate,
          otherAmount: 0,
          subTotalAmount: subTotalAmount,
          discount: UpdatedUser.discount,
          totalAmount: totalAmount,
          amountPaid: UpdatedUser.amountPaid,
          balance: totalAmount - parseFloat(UpdatedUser.amountPaid || 0),
          packagename: UpdatedUser.package,
          ipAddress: UpdatedUser.staticIPAddress,
          describe: [],
        },
      ],
      toDate: new Date(),
      endDate: monthEndDate,
    });

    await statementHistory.save();

    let totalAmountWithoutLastMonthDue =
      packageRate + staticIPAmmount - discount;

    let advanceBalanced = 0;
    let balanced = totalAmountWithoutLastMonthDue;

    if (user.balancedAmount < 0) {
      advanceBalanced = user.balancedAmount;
      if (Math.abs(user.balancedAmount) > balanced) {
        balanced = 0;
        advanceBalanced = Math.abs(user.balancedAmount) - balanced;
      } else {
        balanced = balanced - Math.abs(user.balancedAmount);
      }
    }

    await PaymentModel.findOneAndUpdate(
      { type: "PaymentReport" },
      {
        $inc: {
          totalBalanced: balanced,
          advanceBalanced: advanceBalanced,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (e) {
    console.log("====================================");
    console.log("Error Wiling Update User", e);
    console.log("====================================");
  }
};

// UPdate User Data For checking Month
const UpdateUserData = async () => {
  try {
    const users = await GetUses(); // Await the result from GetUses
    console.log("Users:", users);

    for (let user of users) {
      await updateUser(user);
    }
  } catch (e) {
    console.log("Error in UpdateUserData:", e);
  }
};

module.exports = UpdateUserData;
