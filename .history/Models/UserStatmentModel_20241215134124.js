const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userID: String,
    statementHistory: Array,

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StatementHsitory", Schema);
