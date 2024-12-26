const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    token: String,
    accountID: mongoose.Schema.ObjectId,
  },
  { timestamps: true }
);

Schema.index({ createdAt: 1 }, { expireAfterSeconds: 24000 });

module.exports = mongoose.model("AuthorizationToken", Schema);
