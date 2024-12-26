const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    connectionType: { type: String, required: true },
    port: { type: String },
    vlan: { type: String },
    package: { type: String, required: true },
    packageRate: { type: String, required: true },
    amountPaid: { type: String, default: "" },
    cnicNumber: { type: String, required: true },
    phoneNumber: { type: String },
    cellNumber: { type: String },
    address: { type: String, required: true },
    area: { type: String },
    staticIP: { type: Boolean, default: false },
    staticIPAmmount: { type: String, default: "" },
    staticIPAddress: { type: String, default: "" },
    remark: { type: String, default: "" },
    lastMonthDue: { type: String, default: "" },
    active: { type: Boolean, default: true },
    otherAmount: { type: String, default: "" },
    decribeOtherAmount: { type: Array, default: [] },
    discount: { type: String, default: "" },
    monthStartDate : { type: String, default: }
    totalAmount: { type: Number, default: 0 },
    balancedAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

Schema.pre("save", function (next) {
  let staticIPAmmount = parseFloat(this.staticIPAmmount) || 0;
  let lastMonthDue = parseFloat(this.lastMonthDue) || 0;
  let packageRate = parseFloat(this.packageRate) || 0;
  let amountPaid = parseFloat(this.amountPaid) || 0;
  let otherAmount = parseFloat(this.otherAmount || 0);
  let discount = parseFloat(this.discount || 0);

  let total = staticIPAmmount + lastMonthDue + packageRate + otherAmount;
  total = total - discount;
  const balanced = total - amountPaid;
  this.totalAmount = total;
  this.balancedAmount = balanced;
  console.log("====================================");
  console.log(
    "Pre Save User :  Total ===",
    total,
    " ,   Balanced ===== ",
    balanced
  );
  console.log("====================================");

  next();
});
Schema.pre("findOneAndUpdate", function (next) {
  let updatedData = this.getUpdate();
  let staticIPAmmount = parseFloat(updatedData.$set.staticIPAmmount || 0);
  let lastMonthDue = parseFloat(updatedData.$set.lastMonthDue || 0);
  let packageRate = parseFloat(updatedData.$set.packageRate || 0);
  let amountPaid = parseFloat(updatedData.$set.amountPaid || 0);
  let otherAmount = parseFloat(updatedData.$set.otherAmount || 0);
  let discount = parseFloat(updatedData.$set.discount || 0);

  let total = staticIPAmmount + lastMonthDue + packageRate + otherAmount;
  console.log(
    "Total Before Discount : " + total,
    " And Discount is : " + discount
  );

  total = total - discount;

  console.log(
    "Total After Discount : " + total,
    " And Discount is : " + discount
  );

  let balanced = total - amountPaid;
  updatedData.$set.totalAmount = total;
  updatedData.$set.balancedAmount = balanced;

  console.log("====================================");
  console.log(
    "Pre Update User :  Total ===",
    total,
    " ,   Balanced ===== ",
    balanced
  );

  console.log("====================================");

  next();
});

module.exports = mongoose.model("User", Schema);