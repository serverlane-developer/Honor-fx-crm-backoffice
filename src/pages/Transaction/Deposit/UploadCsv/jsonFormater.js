// file with last single array merge error
export const convertSingleArr = (file) => {
  // get file data from last array element
  const data = file[file.length - 1];
  // heading and data combined in one Array, seprating heading columns from array
  // getting last header by seraching string with new line \n
  const startIndex = data.indexOf(data.find((x) => /[\s\S]*\n[\s\S]*/.test(x)));
  const headers = data.slice(0, startIndex + 1);
  // remove new line \n from last heading column
  headers[headers.length - 1] = headers[headers.length - 1].replace(
    /(.*)\n(\d+)/,
    "$1"
  );
  // array conversion funxtion
  const newArr = [];
  let obj = {};
  data.forEach((x, i) => {
    // skipp starting heading elements from array
    if (i > startIndex) {
      // set new index of array
      if (Object.keys(obj).length === 0) {
        obj[headers[0]] = newArr.length + 1;
      }
      // looping over headers array to create object
      for (let j = 1; j < headers.length; j += 1) {
        if (!obj[headers[j]]) {
          // remove new line \n from each last element
          if (Object.keys(obj).length === headers.length - 1) {
            obj[headers[j]] = x.replace(/(.*)\n(\d+)/, "$1");
          } else {
            obj[headers[j]] = x;
          }
          break;
        }
      }
      if (Object.keys(obj).length === headers.length) {
        newArr.push(obj);
        obj = {};
      }
    }
  });
  // console.log("newArr", newArr);
  return { data: newArr, header: headers };
};

export const convertArray = (file, header, headerIndex) => {
  let jsonData = [];
  // format json data
  const data = file.slice(headerIndex + 1, file.length);
  jsonData = data.map((ele) => {
    const obj = {};
    header.forEach((e, i) => {
      obj[e] = ele[i];
    });
    return obj;
  });
  return { data: jsonData, header };
};

export const separateHeadersAndData = (parsedData) => {
  const referenceOfHeader = [
    "sl. no.",
    "sr.no.",
    "tran date",
    "particulars",
    "value date",
    "tran type",
    "cheque details",
    "withdrawal",
    "deposit",
    "balance amount",
    "balance",
    "date",
    "debit",
    "credit",
    "description",
  ];

  let headerRowIndex;
  const headerRow = parsedData.find((ele, i) => {
    if (ele.some((e) => referenceOfHeader.includes(e.toLowerCase()))) {
      headerRowIndex = i;
      return true;
    }
    return false;
  });

  // if headers and data in a single row
  if (headerRowIndex === parsedData.length - 1) {
    return convertSingleArr(parsedData);
  }
  // if headers and data are in separate rows
  return convertArray(parsedData, headerRow, headerRowIndex);
};

export const getAccNums = (str) => {
  // MB IMPS/IFO/330705736888/INDB0000063/Naa
  // IMPS/P2A/334214800135/PUNB/HARJEET KAUR
  // UPI/334275672446/CR/DEEP/SBIN/9546257787@axl/Payme
  // FT/000084967552/100209109471/MM
  // R/INDBR32023120800756518/SBIN/MANJU CHATURVED
  // N/INDBN06123773827/ICIC/HANI PATEL
  // FT TO INDUSIND ACCOUNT/EWFNRXCSI46Y/100209109471
  // RTGS/MB/RATNH23347722803/JITENDRA HDFC/HDFC BANK LTD
  // IMPS 334717370693 FROM AKASH BHARADWAJ

  if (typeof str === "string") {
    // Regex pattern for account numbers
    const accNumberRegex = /\b\d{12}\b|\b\w{12}\b|\b[A-Z]{5}\d+\b/g;
    if (str.match(accNumberRegex)) {
      return str.match(accNumberRegex)[0];
    }
  }
  return str;
};

// remove "." from object keys to store in mongo
const fixKeys = (obj) => {
  const newObj = {};
  const keys = Object.keys(obj);
  let key;
  let value;
  let fixedKey;
  for (let i = 0; i < keys.length; i += 1) {
    key = keys[i];
    value = obj[key];
    fixedKey = key.replace(/[.]/g, "_");
    newObj[fixedKey] = value;
  }
  return newObj;
};

export const findCommonValues = (arr1, arr2) => {
  const set = new Set(arr1);
  const commonValues = arr2.filter((value) => set.has(value));
  return commonValues;
};

export const formateData = ({ data, name, amount, date, utr, calUtr }) => {
  // console.log("convert data received", data);
  const namePossibility = [
    "transaction details",
    "description",
    "particulars",
    "Transaction Details",
    "Description",
    " Description",
    "Particulars",
  ];
  const amountPossibility = [
    "credit",
    "deposit",
    "deposit amt",
    "deposit amount",
    "Credit",
    "Deposit",
    "Deposit Amt",
    "dredit amt",
    "deposit Amount",
    " Credit",
    "Credit ",
  ];
  const datePossibility = [
    "date",
    "transaction date",
    "tran date",
    "Date",
    "Transaction Date",
    "Tran Date",
  ];

  const headerMap = {
    nameCol: "",
    amountCol: "",
    dateCol: "",
  };

  const fixedData = data.map((x) => fixKeys(x));
  const newData = fixedData.map((ele, i) => {
    const obj = {};
    const keys = Object.keys(ele);
    let nameCol;
    let amountCol;
    let dateCol;
    if (!name) {
      const findName = findCommonValues(keys, namePossibility);
      nameCol = findName.length > 0 ? findName[0] : keys[0];
    } else {
      nameCol = name === "not-available" ? undefined : name;
    }
    if (!amount) {
      const findAmount = findCommonValues(keys, amountPossibility);
      if (i < 3) {
        console.log("find amunt name>>", keys, amountPossibility, findAmount);
      }
      amountCol = findAmount.length > 0 ? findAmount[0] : keys[1];
    } else {
      amountCol = amount === "not-available" ? undefined : amount;
    }
    if (!date) {
      const findDate = findCommonValues(keys, datePossibility);
      dateCol = findDate.length > 0 ? findDate[0] : keys[2];
    } else {
      dateCol = date === "not-available" ? undefined : date;
    }

    headerMap.nameCol = nameCol;
    headerMap.amountCol = amountCol;
    headerMap.dateCol = dateCol;

    const utrCol = utr === "not-available" ? undefined : utr || keys[3];
    obj.name = ele[nameCol];
    obj.amount = ele[amountCol];
    obj.date = ele[dateCol];
    obj.utr = ele[utrCol];
    obj.data = ele;
    if (calUtr) {
      obj.utr = getAccNums(ele[nameCol]);
    }
    return obj;
  });
  return { data: newData, headerMap };
};
