import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from 'react';
const SiteBody = () => {
	const [selectedTable, setSelectedTable] = useState('Choose your table')
  return (<div>
	<Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedTable}
      </Dropdown.Toggle>

      <Dropdown.Menu>
		{['Choose your table','Facilities', 'Employees', ].map((table) => {
		  return(<Dropdown.Item onClick={() => {setSelectedTable(table)}}>{table}</Dropdown.Item>)
		})}
      </Dropdown.Menu>
    </Dropdown>
  </div>);
}
export default SiteBody;