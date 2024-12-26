const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userID: String,
    statementHistory: Array,
    toDate : {type : Date() , default: Date}
  },
  { timestamps: true }
);

module.exports = mongoose.model("StatementHsitory", Schema);
