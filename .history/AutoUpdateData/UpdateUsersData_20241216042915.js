Schema.pre("findOneAndUpdate", function (next) {
  let updatedData = this.getUpdate();
  
  // Extract values and log them
  let staticIPAmmount = parseFloat(updatedData.$set.staticIPAmmount || 0);
  let lastMonthDue = parseFloat(updatedData.$set.lastMonthDue || 0);
  let packageRate = parseFloat(updatedData.$set.packageRate || 0);
  let amountPaid = parseFloat(updatedData.$set.amountPaid || 0);
  let otherAmount = parseFloat(updatedData.$set.otherAmount || 0);
  let discount = parseFloat(updatedData.$set.discount || 0);

  // Log the individual extracted values
  console.log("====================================");
  console.log("staticIPAmmount: ", staticIPAmmount);
  console.log("lastMonthDue: ", lastMonthDue);
  console.log("packageRate: ", packageRate);
  console.log("amountPaid: ", amountPaid);
  console.log("otherAmount: ", otherAmount);
  console.log("discount: ", discount);
  console.log("====================================");

  // Calculate total and balancedAmount
  let total = staticIPAmmount + lastMonthDue + packageRate + otherAmount;
  total = total - discount;

  let balanced = total - amountPaid;
  
  // Update the document with the calculated values
  updatedData.$set.totalAmount = total;
  updatedData.$set.balancedAmount = balanced;

  // Log the calculated totals and balancedAmount
  console.log("====================================");
  console.log("Pre Update User :  Total ===", total, " ,   Balanced ===== ", balanced);
  console.log("====================================");

  next();
});
