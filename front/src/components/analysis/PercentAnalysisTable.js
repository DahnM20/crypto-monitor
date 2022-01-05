import '../../styles/PercentAnalysisTable.css'
import { useTable } from 'react-table'
import { Table } from 'react-bootstrap'

function PercentAnalysisTable({columns, data}){

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function generateColor(value) {
  const n = parseFloat(value)
  if(n > 0){
    let greenValue = (n + 80)/100 * 255 ;
    console.log(n + ' g ' + greenValue)
    return 'rgb(0,' + greenValue + ', 100)';
  } else if (n < 0){
      let redValue = (n - 80)/100 * 255 * -1;
      console.log(n + ' r ' + redValue)
      return 'rgb(' + redValue + ', 0, 100)';
  } else {
      return 'rgb(200, 200, 200)';
  }
}

  // Render the UI for your table
  return (
    <Table bordered variant="dark" responsive {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                if(isNumeric(cell.value)){
                    return <td style={{ backgroundColor:generateColor(cell.value) }} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                } else {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                }
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )

}


export default PercentAnalysisTable;