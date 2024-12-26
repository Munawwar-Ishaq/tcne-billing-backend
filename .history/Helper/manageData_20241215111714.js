const AmmountStatement = require("../Models/AmmountStatement");
const PaymentModel = require("../Models/PaymentModel");
const UserModel = require("../Models/UserModel");
const UserStatmentModel = require("../Models/UserStatmentModel");
const { formatDate } = require("./helper");

module.exports.addUser = async (data) => {
  const user = new UserModel(data);
  await user.save();

  let subTotalAmmount =
    parseFloat(user.packageRate || 0) +
    parseFloat(user.otherAmount || 0) +
    parseFloat(user.staticIPAmmount || 0) +
    parseFloat(user.lastMonthDue || 0);

  let totalAmmount =
    parseFloat(user.packageRate || 0) +
    parseFloat(user.lastMonthDue || 0) +
    parseFloat(user.otherAmount || 0) -
    parseFloat(user.discount || 0);

  if (user.staticIP) {
    totalAmmount += Number(user.staticIPAmmount);
  }

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
    package: user.package,
    totalAmmount: totalAmmount,
    active: true,
    toDate: new Date(),
    end 
  });

  await statementHistory.save();

  let totalAmount =
    parseFloat(user.packageRate || 0) +
    parseFloat(user.lastMonthDue || 0) +
    parseFloat(user.otherAmount || 0) -
    parseFloat(user.discount || 0);
  if (user.staticIP) {
    totalAmount += parseFloat(user.staticIPAmmount || 0);
  }

  let amountPaid = parseFloat(user.amountPaid || 0);
  let totalSale = amountPaid;
  let advanceBalanced = 0;
  let balanced = 0;

  if (totalAmount < amountPaid) {
    advanceBalanced = amountPaid - totalAmount;
  } else {
    balanced = totalAmount - amountPaid;
  }

  let paymentReport = await PaymentModel.findOneAndUpdate(
    { type: "PaymentReport" },
    {
      $inc: {
        totalBalanced: balanced,
        totaSale: totalSale,
        advanceBalanced: advanceBalanced,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  if (user.amountPaid !== "") {
    let NewAmountStatement = new AmmountStatement({
      userID: user.userId,
      amount: user.amountPaid,
      name: user.username,
      date: formatDate(new Date()),
    });
    await NewAmountStatement.save();
  }

  return {
    user,
    paymentReport,
  };
};
