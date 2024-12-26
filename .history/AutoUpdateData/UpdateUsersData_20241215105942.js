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

}catch (e) {
  log
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
