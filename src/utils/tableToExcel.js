import fs from 'file-saver'
// import XLSX from 'xlsx'

export function exportToExcel(data, filename = '.xlsx', test) { // 导出xlsx
  const json = JSON.parse(JSON.stringify(data))
  const XLSX = require('xlsx')
  const XLSXD = require('xlsx-style')
  const sheetName = filename // excel的文件名称
  const wb = XLSX.utils.book_new() // 工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
  const ws = XLSX.utils.json_to_sheet(json) // 将JS对象数组转换为工作表。
  for (const key in ws) {
    if (ws[key].v && ws[key].v.indexOf && ws[key].v.indexOf('(活水)') !== -1) {
      ws[key].s = {
        ...ws[key].s,
        font: { // 覆盖字体
          color: { rgb: 'FF0000' }
        }
      }
    }
  }
  wb.SheetNames.push(sheetName)
  wb.Sheets[sheetName] = ws
  const blob = new Blob([s2ab(XLSXD.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyle: true }))])
  fs.saveAs(blob, filename + '.xlsx')
}

const s2ab = s => {
  let buf
  if (typeof ArrayBuffer !== 'undefined') {
    buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  } else {
    buf = new Array(s.length)
    for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
    return buf
  }
}

