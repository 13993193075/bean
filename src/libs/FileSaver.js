import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

/**
 * 将 JSON 数组数据导出为 Excel 文件
 * @param {Array<Object>} json - 要导出的数据数组 (el-table 的 :data 绑定的数据)
 * @param {Array<string>} header - 表格的表头（中文名）
 * @param {Array<string>} keys - 对应表头的数据字段名（英文键名）
 * @param {string} filename - 导出的文件名
 */
function jsonToExcel({
  json,
  header,
  keys,
  filename = 'excel-file',
}) {
  // 1. 转换数据格式
  const data = json.map(item => keys.map(key => item[key]));
  
  // 2. 将表头和数据组合
  const aoa = [header, ...data];

  // 3. 创建工作簿和工作表
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // 4. 生成 Excel 文件
  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  });

  // 5. 保存文件
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `${filename}.xlsx`
    );
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout);
  }
}

const bean = {
    jsonToExcel
}
export default bean