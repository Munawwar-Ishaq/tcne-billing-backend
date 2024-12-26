const FormModel = require("../Models/FormModel");

const Controller = (req , res) => {

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

      let { id  , type} =  req.params

      await FormModel.dele

}

module.exports = Controller;