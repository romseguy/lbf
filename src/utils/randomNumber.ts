import * as crypto from "crypto";

export const randomNumber = (maxNumber: number | undefined) => {
  let randomNumberString;
  switch (maxNumber) {
    case 1:
      randomNumberString = crypto.randomInt(1, 9).toString();
      break;
    case 2:
      randomNumberString = crypto.randomInt(10, 90).toString();
      break;
    case 3:
      randomNumberString = crypto.randomInt(100, 900).toString();
      break;
    case 4:
      randomNumberString = crypto.randomInt(1000, 9000).toString();
      break;
    case 5:
      randomNumberString = crypto.randomInt(10000, 90000).toString();
      break;
    case 6:
      randomNumberString = crypto.randomInt(100000, 900000).toString();
      break;
    default:
      randomNumberString = "";
      break;
  }
  return randomNumberString;
};
