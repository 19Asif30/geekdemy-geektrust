const fs = require("fs");

const filename = process.argv[2];

fs.readFile(filename, "utf8", (err, data) => {
  if (err) throw err;
  let inputLines = data.toString().split("\n");
  const programmes = {
    CERTIFICATION: 3000,
    DEGREE: 5000,
    DIPLOMA: 2500,
  };
  let purchases = {};
  let sub_total = 0;
  let coupon_discount = 0;
  let total_pro_discount = 0;
  let pro_membership_fee = 0;
  let enrollment_fee = 0;
  let total = 0;
  let program_count = 0;
  let lowest_valued = 0;
  let coupons = [];
  let coupon_chosen = "";

  for (let i in inputLines) {
    if (inputLines[i].includes("\r")) {
      inputLines[i] = inputLines[i].replace("\r", "");
    }
  }

  for (let i = 0; i < inputLines.length; i++) {
    let item = inputLines[i];
    if (item.includes("ADD_PROGRAMME")) {
      let itemArr = item.split(" ");
      purchases[itemArr[1]] = [
        parseInt(itemArr[2]),
        programmes[itemArr[1]] * parseInt(itemArr[2]),
      ];
      program_count += parseInt(itemArr[2]);
    } else if (item.includes("ADD_PRO_MEMBERSHIP")) {
      pro_membership_fee = 200;
      for (let j in purchases) {
        if (j === "DIPLOMA") {
          let pro_discount = purchases[j][1] * 0.01;
          purchases[j][1] -= pro_discount;
          total_pro_discount += pro_discount;
        } else if (j === "CERTIFICATION") {
          let pro_discount = purchases[j][1] * 0.02;
          purchases[j][1] -= pro_discount;
          total_pro_discount += pro_discount;
        } else if (j === "DEGREE") {
          let pro_discount = purchases[j][1] * 0.03;
          purchases[j][1] -= pro_discount;
          total_pro_discount += pro_discount;
        }
      }
    } else if (item.includes("APPLY_COUPON")) {
      coupons.push(item.split(" ")[1]);
    }
  }
  sub_total += pro_membership_fee;
  lowest_valued =
    Object.values(purchases)[0][1] / Object.values(purchases)[0][0];
  for (let i in purchases) {
    sub_total += purchases[i][1];
    if (purchases[i][1] / purchases[i][0] < lowest_valued) {
      lowest_valued = purchases[i][1] / purchases[i][0];
    }
  }

  if (program_count >= 4) {
    total = sub_total - lowest_valued;
    coupon_discount = lowest_valued;
    coupon_chosen = "B4G1";
  } else if (coupons.length > 0) {
    if (coupons.length === 1) {
      let disc = coupons[0];
      if (disc === "DEAL_G20" && sub_total >= 10000) {
        total = sub_total - sub_total * 0.2;
        coupon_discount = sub_total * 0.2;
        coupon_chosen = "DEAL_G20";
      } else if (program_count >= 2) {
        total = sub_total - sub_total * 0.05;
        coupon_discount = sub_total * 0.05;
        coupon_chosen = "DEAL_G5";
      }
    } else if (coupons.length > 1) {
      if (coupons.includes("DEAL_G20") && sub_total >= 10000) {
        total = sub_total - sub_total * 0.2;
        coupon_discount = sub_total * 0.2;
        coupon_chosen = "DEAL_G20";
      } else if (program_count >= 2) {
        total = sub_total - sub_total * 0.05;
        coupon_discount = sub_total * 0.05;
        coupon_chosen = "DEAL_G5";
      }
    }
  }

  if (coupon_chosen === "") {
    coupon_chosen = "NONE";
  }
  if (total < 6666) {
    total += 500;
    enrollment_fee = 500;
  }

  console.log(`SUB_TOTAL\t${sub_total.toFixed(2)}`);
  console.log(
    `COUPON_DISCOUNT\t${coupon_chosen}\t${coupon_discount.toFixed(2)}`
  );
  console.log(`TOTAL_PRO_DISCOUNT\t${total_pro_discount.toFixed(2)}`);
  console.log(`PRO_MEMBERSHIP_FEE\t${pro_membership_fee.toFixed(2)}`);
  console.log(`ENROLLMENT_FEE\t${enrollment_fee.toFixed(2)}`);
  console.log(`TOTAL\t${total.toFixed(2)}`);
});
