const UserModel = require("../Models/UserModel");

// Get USer ONe Month Before
const GetUses = async () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const users =  await UserModel.find({
        createdAt: {
            $gte: oneMonthAgo,
            $lt: new Date()
        }
    })
}

// UPdate User Data For checking Month
const UpdateUserData = () => {
  

};
