import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillCloseSquare, AiFillEdit } from 'react-icons/ai';
import { IoAddCircle } from 'react-icons/io5';
import { Modal, Button, Form } from 'react-bootstrap';

const SiteBody = () => {
  const [selectedTable, setSelectedTable] = useState();
  const [selectedQuery, setSelectedQuery] = useState();
  const [queryResult, setQueryResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tableList, setTableList] = useState();
  const [rowEdit, setRowEdit] = useState();
  const [rowAdd, setRowAdd] = useState();
  const [rowDelete, setRowDelete] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const queryList = [
    {
      id: 6,
      name: '6. Get all facilities',
      keys: [],
    },
    {
      id: 7,
      name: '7. Get all employees from facility',
      keys: [
        { name: 'name', defValue: '' },
        { name: 'address', defValue: '' },
      ],
    },
    {
      id: 8,
      name: '8. Get all schedules of an employee',
      keys: [{ name: 'medicareNb', defValue: '12345678' }],
    },
    {
      id: 9,
      name: '9. Get all doctors infected by covid in past 2 weeks',
      keys: [],
    },
    {
      id: 10,
      name: '10. List all emails generated by a facility',
      keys: [
        { name: 'name', defValue: 'Centre Médical Côte-des-Neiges' },
        { name: 'address', defValue: '5800 Chemin de la Côte-des-Neiges' },
      ],
    },
    {
      id: 11,
      name: '11. List all doctors & nurses on schedule in the last two weeks for a given facility',
      keys: [
        { name: 'name', defValue: '' },
        { name: 'address', defValue: '' },
      ],
    },
    {
      id: 12,
      name: '12. For a given facility, give the total hours scheduled for every role during a specific period',
      keys: [
        { name: 'name', defValue: '' },
        { name: 'address', defValue: '' },
        { name: 'startDate', defValue: '' },
        { name: 'endDate', defValue: '' },
      ],
    },
    {
      id: 13,
      name: '13. Get province, name, capacity and total number of employees infected by COVID-19 in past 2 weeks for every facility',
      keys: [],
    },
    {
      id: 14,
      name: '14. Get information from every doctor currently working in Québec',
      keys: [],
    },
    {
      id: 15,
      name: `15. Get currently working nurse(s) with highest hours `,
      keys: [],
    },
    {
      id: 16,
      name: '16. Get currently working doctor(s) or nurse(s) that got COVID-19 at least 3 times',
      keys: [],
    },
    {
      id: 17,
      name: '17. Get currently working doctor(s) or nurse(s) that never got COVID-19',
      keys: [],
    },
  ];
  //Gets all the tables
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
      //console.log(tempList);
    });
  }, []);

  //Gets selected table data
  const handleTableDropdownSelect = (table) => {
    setErrorMessage(undefined);
    setSelectedTable(table);
    selectedQuery && setSelectedQuery(undefined);
    setIsLoading(true);
    axios({
      method: 'post',
      url: `http://localhost:8000/PHP/selectAllFromTable.php`,
      headers: { 'content-type': 'application/json' },
      data: {
        tableName: table,
      },
    })
      // .then((result) => console.log(result.data))
      .then((result) => {
        setQueryResult(result.data);
      })
      .catch((error) => console.log(error.message));
    setIsLoading(false);
  };

  const handleQueryDropdownSelect = (query) => {
    setErrorMessage(undefined);
    selectedTable && setSelectedTable(undefined);
    queryResult && setQueryResult(undefined);
    setSelectedQuery(query);
  };
  const handleModalClose = () => {
    rowEdit && setRowEdit(undefined);
    rowAdd && setRowAdd(undefined);
    rowDelete && setRowDelete(undefined);
  };

  const handleExecuteQuery = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    setIsLoading(true);
    setErrorMessage(undefined);
    axios({
      method: 'post',
      url: `http://localhost:8000/PHP/queries/${selectedQuery.id}.php`,
      headers: { 'content-type': 'application/json' },
      data: {
        keys: formJson,
      },
    })
      .then((result) => {
        console.log(result.data);
        result.data.length ? setQueryResult(result.data) : setErrorMessage('No result found.');
      })
      .catch((error) => console.log(error));
    setIsLoading(false);
  };
  const handleEditModalSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(Array.from(formData.entries()).filter(([_, v]) => v !== ''));
    const fullData = { ...rowEdit, ...formJson };

    axios({
      method: 'post',
      url: `http://localhost:8000/PHP/editRowFrom${selectedTable}.php`,
      headers: { 'content-type': 'application/json' },
      data: {
        row: fullData,
      },
    }).then((result) => {
      console.log(result.data);
    });
    handleTableDropdownSelect(selectedTable);
    handleModalClose();
  };
  const handleAddModalSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(Array.from(formData.entries()).filter(([_, v]) => v !== ''));
    const fullData = { ...rowEdit, ...formJson };

    axios({
      method: 'post',
      url: `http://localhost:8000/PHP/addRow.php`,
      headers: { 'content-type': 'application/json' },
      data: {
        tableName: selectedTable,
        row: fullData,
      },
    }).then((result) => {
      console.log(result.data);
    });
    handleTableDropdownSelect(selectedTable);
    handleModalClose();
  };
  const handleDeleteRow = () => {
    axios({
      method: 'post',
      url: `http://localhost:8000/PHP/deleteRow.php`,
      headers: { 'content-type': 'application/json' },
      data: {
        tableName: selectedTable,
        row: rowDelete,
      },
    }).then((result) => {
      console.log(result.data);
    });
    handleTableDropdownSelect(selectedTable);
    handleModalClose();
  };
  return (
    <div className='flex flex-col items-center gap-y-4'>
      <div className='flex flex-row items-center justify-center gap-x-4'>
        <Dropdown>
          <Dropdown.Toggle variant='success' id='dropdown-basic'>
            {selectedTable ? selectedTable : 'Choose your table'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {tableList &&
              tableList.map((table) => {
                return <Dropdown.Item onClick={() => handleTableDropdownSelect(table)}>{table}</Dropdown.Item>;
              })}
          </Dropdown.Menu>
        </Dropdown>
        <span>OR</span>
        <Dropdown>
          <Dropdown.Toggle variant='primary' id='dropdown-basic'>
            {selectedQuery ? selectedQuery.name : 'Choose your query'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {queryList.map((query) => {
              return <Dropdown.Item onClick={() => handleQueryDropdownSelect(query)}>{query.name}</Dropdown.Item>;
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {selectedQuery && (
        <Form className='flex items-end gap-x-6 ' onSubmit={handleExecuteQuery}>
          {Object.entries(selectedQuery.keys).map((key) => {
            return (
              <Form.Group>
                <Form.Label>{key[1].name}</Form.Label>
                <Form.Control name={key[1].name} defaultValue={key[1].defValue} />
              </Form.Group>
            );
          })}
          <Button variant='primary' type='submit' className='h-fit'>
            Execute query
          </Button>
        </Form>
      )}
      {(isLoading && <Spinner></Spinner>) ||
        (errorMessage && <span>{errorMessage}</span>) ||
        (queryResult && (
          <div className='flex flex-col gap-y-1'>
            <div className='flex flex-row items-center gap-2'>
              <span className='text-2xl font-bold'>{selectedTable || selectedQuery.name}</span>
              <IoAddCircle
                className='h-7 w-7 text-green-600 hover:cursor-pointer hover:text-green-700'
                onClick={() => {
                  setRowAdd(Object.keys(queryResult[0]));
                }}
              ></IoAddCircle>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  {Object.keys(queryResult[0]).map((key) => (
                    <th>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResult &&
                  queryResult.map((row) => {
                    return (
                      <>
                        <tr className=''>
                          {Object.values(row).map((attribute) => {
                            return <td>{attribute}</td>;
                          })}
                          {selectedTable && (
                            <>
                              <td>
                                <AiFillEdit
                                  className='block h-7 w-7 hover:cursor-pointer'
                                  onClick={() => {
                                    setRowEdit(row);
                                  }}
                                ></AiFillEdit>
                              </td>
                              <td>
                                <AiFillCloseSquare
                                  className='block h-7 w-7 text-red-700 hover:cursor-pointer hover:text-red-800'
                                  onClick={() => {
                                    setRowDelete(row);
                                  }}
                                ></AiFillCloseSquare>
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        ))}
      <Modal show={rowEdit} centered onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit row in {selectedTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='flex flex-col flex-wrap  gap-y-4' onSubmit={handleEditModalSubmit}>
            {rowEdit &&
              Object.entries(rowEdit).map((attribute) => {
                return (
                  <Form.Group>
                    <Form.Label>{attribute[0]}</Form.Label>
                    <Form.Control placeholder={attribute[1]} name={attribute[0]} />
                  </Form.Group>
                );
              })}
            <div className='flex flex-row justify-end gap-x-4'>
              <Button variant='primary' type='submit' className='w-fit'>
                Submit
              </Button>
              <Button variant='secondary' className='w-fit' onClick={handleModalClose}>
                Close
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={rowAdd} centered onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add tuple in {selectedTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='flex flex-col flex-wrap  gap-y-4' onSubmit={handleAddModalSubmit}>
            {rowAdd &&
              Object.entries(rowAdd).map((attribute) => {
                return (
                  <Form.Group>
                    <Form.Label>{attribute[1]}</Form.Label>
                    <Form.Control name={attribute[1]} />
                  </Form.Group>
                );
              })}
            <div className='flex flex-row justify-end gap-x-4'>
              <Button variant='primary' type='submit' className='w-fit'>
                Submit
              </Button>
              <Button variant='secondary' className='w-fit' onClick={handleModalClose}>
                Close
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={rowDelete} centered size='xl' onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove tuple in {selectedTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this row?
          <Table bordered>
            <thead>
              <tr>{rowDelete && Object.keys(rowDelete).map((key) => <th>{key}</th>)}</tr>
            </thead>
            <tbody>
              <tr>
                {rowDelete &&
                  Object.values(rowDelete).map((attribute) => {
                    return <td>{attribute}</td>;
                  })}
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleDeleteRow}>
            Delete
          </Button>
          <Button variant='secondary' onClick={handleModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default SiteBody;
