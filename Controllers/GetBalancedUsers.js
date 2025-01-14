const UserModeld = require("../Models/UserModel");
const AdminModel = require("../Models/AdminModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (
    !find.access.ass.includes("All") &&
    !find.access.ass.includes("View balanced Statement") 
  ) {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  try {
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * 10;

    const data = await UserModeld.find({
      balancedAmount: {
        $gt: 0,
      }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(15)
      .select("userId username createdAt balancedAmount");

    const totalDocuments = await UserModeld.countDocuments({
      balancedAmount: {
        $gt: 0,
      },
    });

    res.status(200).json({
      message: "Balanced User data fetched successfully.",
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / 10),
      data,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch advance payment User Data." });
  }
};

module.exports = Controller;
