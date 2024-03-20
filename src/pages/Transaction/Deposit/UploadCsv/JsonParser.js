import * as XLSX from "xlsx";
import Papa from "papaparse";

export const xlsxParser = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming there's only one sheet, you can modify this logic for multiple sheets
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: true,
      });

      // Do something with the jsonData, for example, log it to console
      // console.log("xls to jason return", jsonData);
      // returnData = { data: jsonData, singleArr: true };
      resolve({ data: jsonData, singleArr: false });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

export const csvParser = async (file) => {
  const readFileAsync = (rcvFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          resolve(event.target.result);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(rcvFile);
    });
  };

  const parseCsvToJson = (csvText) => {
    let returnData;
    let singleArr = false;
    let error;
    Papa.parse(csvText, {
      complete: (result) => {
        console.log("result", result);
        if (result.errors.length > 0 && result.errors[0].type === "Delimiter") {
          singleArr = true;
        } else {
          error = "CSV file foramate error!!";
        }
        if (result.errors.length === 0) {
          singleArr = false;
        }
        returnData = result.data;
        // return result;
      },
      // header: true, // Treat the first row as headers
      skipEmptyLines: true, // Skip empty lines in CSV
    });
    console.log("csv to json return", returnData);
    return { data: returnData, singleArr, error };
  };

  const fileData = await readFileAsync(file);

  const parseFileData = parseCsvToJson(fileData);
  return parseFileData;
};
