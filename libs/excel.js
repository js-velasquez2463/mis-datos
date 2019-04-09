const excel = require('node-excel-export')
const moment = require('moment')

const styles = {
  headerDark: {
    font: {
      color: {
        rgb: 'FF000000'
      },
      sz: 12,
      bold: true
    }
  }
}

const heading = [
  [{value: 'id', style: styles.headerDark},
    {value: 'created_date', style: styles.headerDark},
    {value: 'value', style: styles.headerDark},
    {value: 'points', style: styles.headerDark},
    {value: 'status', style: styles.headerDark}]
]

/**
 *Exports an excel file
 *
 * @param {Array} dataExcel
 * @returns the buffer of the created excel file
 */
async function exportExcel (data, fileName) {
  try {
    const specification = {
      id: {
        displayName: 'id',
        width: 50
      },
      createdAt: {
        cellFormat: function (value, row) {
          return moment(value).format('YYYY-MM-DD hh:mm:ss A')
        },
        width: 200
      },
      value: {
        displayName: 'value',
        width: 100
      },
      points: {
        width: 100
      },
      status: {
        cellFormat: function (value, row) {
          return (value === 1) ? 'Active' : 'Inactive'
        },
        width: 100
      }
    }

    const merges = [
      { start: { row: 2, column: 1 }, end: { row: 2, column: 10 } }
    ]
    const dataExcel = [{
      name: `Report ${fileName}`,
      heading: heading,
      merges,
      specification: specification,
      data
    }]
    const report = await excel.buildExport(dataExcel)
    return report
  } catch (error) {
    console.error('Excel error', error)
    throw error
  }
}

module.exports = {exportExcel}
