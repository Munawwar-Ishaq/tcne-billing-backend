const AdminModel = require("../Models/AdminModel");
const AmmountStatement = require("../Models/AmmountStatement");

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

  let { date } = req.query;

  let findSaleUserList = await Expan.find({
    date: date,
  }).select("-_id -createdAt");

  res.json({ list: findSaleUserList, date: date });
};

module.exports = Controller;
