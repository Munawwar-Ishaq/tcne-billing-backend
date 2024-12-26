const UserModel = require("../Models/UserModel");

// Get USer ONe Month Before
const GetUses = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  let allUsers = [];
  const users = await UserModel.find({
    createdAt: {
      $lt: oneMonthAgo,
    },
  });

  allUsers = []
};

// UPdate User Data For checking Month
const UpdateUserData = () => {};
