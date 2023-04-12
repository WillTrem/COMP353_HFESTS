import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import axios from 'axios';

const SiteBody = () => {
  const [selectedTable, setSelectedTable] = useState('Choose your table');
  const [queryResult, setQueryResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tableList, setTableList] = useState();
  if (!tableList) {
  }
  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:8000/PHP/getAllTables.php`,
      headers: { 'content-type': 'application/json' },
    }).then((result) => {
      let tempList = [];
      result.data.forEach((table) => {
        tempList.push(table[0]);
      });
      setTableList(tempList);
      console.log(tempList);
    });
  }, []);

  const handleOnDropdownSelect = (table) => {
    setSelectedTable(table);
    setIsLoading(true);
    axios({
      method: 'post',
      url: `http://localhost:8000/PHP/server.php`,
      headers: { 'content-type': 'application/json' },
      data: {
        tableName: table,
      },
    })
      // .then((result) => console.log(result.data))
      .then((result) => {
        setQueryResult(result.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error.message));
  };
  return (
    <div className='flex flex-col items-center gap-y-4'>
      <Dropdown>
        <Dropdown.Toggle variant='success' id='dropdown-basic'>
          {selectedTable}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {tableList &&
            tableList.map((table) => {
              return <Dropdown.Item onClick={() => handleOnDropdownSelect(table)}>{table}</Dropdown.Item>;
            })}
        </Dropdown.Menu>
      </Dropdown>
      {(isLoading && <Spinner></Spinner>) || (
        <Table striped bordered>
          <thead>
            <tr>{queryResult && Object.keys(queryResult[0]).map((key) => <th>{key}</th>)}</tr>
          </thead>
          <tbody>
            {queryResult &&
              queryResult.map((row) => {
                return (
                  <tr>
                    {Object.values(row).map((attribute) => {
                      return <td>{attribute}</td>;
                    })}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}
    </div>
  );
};
export default SiteBody;
