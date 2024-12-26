const { formatDate } = require("../Helper/helper");
const AdminModel = require("../Models/AdminModel");
const ExpanceModel = require("../Models/ExpanceModel");
const PaymentModel = require("../Models/PaymentModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  console.log(userID);

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid admin." });
  }

  if (find.role !== "admin") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  let data = req.body;

  let newExpance = new ExpanceModel({
    amount: parseFloat(data.amount || 0),
    date: formatDate(new Date()),
    name: find.name,
    reason: data.reason,
  });

  await newExpance.save();

  let paymentReport = await PaymentModel.findOneAndUpdate(
    { type: "PaymentReport" },
    {
      $inc: {
        expanseAmount: parseFloat(data.amount || 0),
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.send({
    message: "Expance added successfully.",
    paymentReport: paymentReport,
  });
};

module.exports = Controller;
