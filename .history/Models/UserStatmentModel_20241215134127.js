const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userID: String,
    statementHistory: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("StatementHsitory", Schema);
