import * as XLSX from 'xlsx';

/**
 * 读取xlsx中所有sheet名
 * @param file
 * @returns Promise<string[]>
 */
const getXlsxSheets = (file: File): Promise<string[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (event: Event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'array' });

      // 获取所有sheet的名字
      const sheetNames = workbook.SheetNames;
      resolve(sheetNames);

      // 读取每个sheet的内容并转换为JSON对象数组
      // sheetNames.forEach(function (sheetName: string) {
      //     var worksheet = workbook.Sheets[sheetName];
      //     var sheetData = XLSX.utils.sheet_to_json(worksheet);
      //     console.log(`Sheet Name: ${sheetName}`);
      //     console.log("Sheet Data:", sheetData);
      // });
    };

    reader.readAsArrayBuffer(file);
  });
};

export default getXlsxSheets;
