import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import axios from 'axios'



const SiteBody = () => {
	const [selectedTable, setSelectedTable] = useState('Choose your table')
  const [queryResult, setQueryResult] = useState();
  const handleOnDropdownSelect = (table) => {
   
    setSelectedTable(table);
    axios({
      method: 'post',
      url: `http://localhost:8000/server.php`,
      headers: { 'content-type': 'application/json' },
      data: {
        tableName: table
      }
    }).then((result) => {setQueryResult(result.data)})
      .catch(error => console.log(error.message));
  };
  return (<div>
	<Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedTable}
      </Dropdown.Toggle>

      <Dropdown.Menu>
		{['Choose your table','Facilities', 'Employees', ].map((table) => {
		  return(<Dropdown.Item onClick={() => handleOnDropdownSelect(table)}>{table}</Dropdown.Item>)
		})}
      </Dropdown.Menu>
    </Dropdown>
    <Table>
      <tbody>
      {queryResult && queryResult.map((row) => { return <tr>
        {row.map((attribute) => {
          return <td>{attribute}</td>
        })}
        </tr>})}
      </tbody>
    </Table>
    
  </div>);
}
export default SiteBody;