const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userID: String,
    statementHistory: Array,
    toDate : 
  },
  { timestamps: true }
);

module.exports = mongoose.model("StatementHsitory", Schema);
