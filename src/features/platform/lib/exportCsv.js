export function exportCsv(filename, rows) {
  const cell = value => `"${String(value ?? '').replace(/^[=+@\-\t\r]/, match => `'${match}`).replaceAll('"', '""')}"`
  const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
