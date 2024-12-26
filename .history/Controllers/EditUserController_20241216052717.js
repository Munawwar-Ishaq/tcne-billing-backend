const { formatDate } = require("../Helper/helper");
const AdminModel = require("../Models/AdminModel");
const AmmountStatement = require("../Models/AmmountStatement");
const PaymentModel = require("../Models/PaymentModel");
const UserModel = require("../Models/UserModel");
const UserStatmentModel = require("../Models/UserStatmentModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (find.role !== "admin") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  let { data, editedStatement } = req.body;

  console.log("Body", req.body);

  if (!data.connectionType) {
    let foundUserData = await UserModel.findOne({ userId: data.userId }).select(
      "staticIPAmmount lastMonthDue packageRate otherAmount discount username"
    );

    if (data.amountAdd  0) {
      await AmmountStatement.findOneAndUpdate(
        {
          userID: data.userId,
          name: foundUserData.username, 
          date: formatDate(new Date()),
        },
        {
          $inc: {
            amount: data.amountAdd,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
    }

    if (!foundUserData) {
      return res.status(404).json({ error: "User not found." });
    }

    data = {
      amountPaid: data.amountPaid,
      staticIPAmmount: foundUserData.staticIPAmmount,
      lastMonthDue: foundUserData.lastMonthDue,
      packageRate: foundUserData.packageRate,
      otherAmount: data.otherAmount,
      decribeOtherAmount: data.decribeOtherAmount,
      discount: foundUserData.discount,
      userId: data.userId,
    };
  }

  let statements = editedStatement.statements;

  let balanced = editedStatement.balancedAmount;
  let totalSale = editedStatement.totalSaleAmount;
  let advanceBalanced = editedStatement.advanceBalancedAmount;

  if (!data || !statements || !Array.isArray(statements)) {
    return res.status(400).json({ error: "Invalid data or statements." });
  }

  let userdataid = data.userId;

  let findUserDataWithUserID = await UserModel.findOne({ userId: userdataid });

  if (!findUserDataWithUserID) {
    return res.status(404).json({ error: "User not found." });
  }

  let statementHistory = await UserStatmentModel.findOne({
    userID: findUserDataWithUserID._id.toString(),
    endDate: findUserDataWithUserID.monthEndDate,
  });

  if (!statementHistory) {
    let totalAmmount =
      Number(findUserDataWithUserID.packageRate) +
      Number(findUserDataWithUserID.lastMonthDue) +
      parseFloat(findUserDataWithUserID.otherAmount || 0) -
      parseFloat(findUserDataWithUserID.discount || 0);

    if (findUserDataWithUserID.staticIP) {
      totalAmmount += Number(findUserDataWithUserID.staticIPAmmount);
    }

    statementHistory = new UserStatmentModel({
      userID: findUserDataWithUserID._id.toString(),
      statementHistory: [],
    });
  }

  if (statements.length > 0) {
    statementHistory.statementHistory =
      statementHistory.statementHistory.concat(statements);
    statements.map((obj) => {
      if (obj.type === "userStatus") {
        statementHistory.active = obj.newUserStatus;
      } else {
        statementHistory.totalAmmount = obj.newTotalAmount;
      }
    });
  }

  try {
    let userData = await UserModel.findOneAndUpdate(
      { _id: findUserDataWithUserID._id.toString() },
      { $set: { ...data } },
      { new: true, runValidators: true }
    );

    await statementHistory.save();

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

    res.status(200).json({
      success: "User Updated successfully.",
      data: userData,
      paymentReport,
    });
  } catch (err) {
    console.log("Error updating user data : ", err);
    return res.status(500).json({ error: "Failed to update user data." });
  }
};

module.exports = Controller;
