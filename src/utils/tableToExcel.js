/*
import FileSaver from 'file-saver'
export function exportToExcel(fliename, dom, that) {
  const XLSX = require('xlsx')
  console.log('XLSX', XLSX, FileSaver)
  // 使用 this.$nextTick 是在dom元素都渲染完成之后再执行document.querySelector('#oIncomTable')
  that.$nextTick(function() {
    // 设置导出的内容是否只做解析，不进行格式转换     false：要解析， true:不解析
    const xlsxParam = { raw: true }
    const wb = XLSX.utils.table_to_book(dom, xlsxParam)
    // 导出excel文件名
    const fileName = fliename + new Date().getTime() + '.xlsx'

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'array'
    })
    try {
      // 下载保存文件
      FileSaver.saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        fileName
      )
    } catch (e) {
      if (typeof console !== 'undefined') {
        console.log(e, wbout)
      }
    }
    return wbout
  })
}
*/

import fs from 'file-saver'

export function exportToExcel(json, fields, filename = '.xlsx') { // 导出xlsx
  const XLSX = require('xlsx')
  json.forEach(item => {
    for (const i in item) {
      // eslint-disable-next-line no-prototype-builtins
      if (fields.hasOwnProperty(i)) {
        item[fields[i]] = item[i]
      }
      delete item[i] // 删除原先的对象属性
    }
  })
  const sheetName = filename // excel的文件名称
  const wb = XLSX.utils.book_new() // 工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
  const ws = XLSX.utils.json_to_sheet(json, { header: Object.values(fields) }) // 将JS对象数组转换为工作表。
  wb.SheetNames.push(sheetName)
  wb.Sheets[sheetName] = ws
  /* for (const key in ws) {
    if (ws[key].v && ws[key].v.indexOf && ws[key].v.indexOf('1') !== -1) {
      ws[key].s = {
        ...ws[key].s,
        font: { // 覆盖字体
          name: '等线',
          sz: 11,
          bold: true
        }
      }
    }
  }*/
  const defaultCellStyle = { font: { name: 'Verdana', sz: 13, color: 'FF00FF88' }, fill: { fgColor: { rgb: 'FFFFAA00' }}}// 设置表格的样式
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false } // 写入的样式
  const wbout = XLSX.write(wb, wopts)
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
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

