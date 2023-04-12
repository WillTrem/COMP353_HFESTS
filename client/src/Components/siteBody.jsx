import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillCloseSquare, AiFillEdit } from 'react-icons/ai';
import { IoAddCircle } from 'react-icons/io5';
import { Modal, Button, Form } from 'react-bootstrap';

const SiteBody = () => {
  const [selectedTable, setSelectedTable] = useState('Choose your table');
  const [queryResult, setQueryResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tableList, setTableList] = useState();
  const [rowEdit, setRowEdit] = useState();
  const [rowAdd, setRowAdd] = useState();
  const [rowDelete, setRowDelete] = useState();

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

  const handleModalClose = () => {
    rowEdit && setRowEdit(undefined);
    rowAdd && setRowAdd(undefined);
    rowDelete && setRowDelete(undefined);
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
    handleOnDropdownSelect(selectedTable);
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
    handleOnDropdownSelect(selectedTable);
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
    handleOnDropdownSelect(selectedTable);
    handleModalClose();
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
      {(isLoading && <Spinner></Spinner>) ||
        (queryResult && (
          <div className='flex flex-col gap-y-1'>
            <div className='flex flex-row items-center gap-2'>
              <span className='text-2xl font-bold'>{selectedTable}</span>
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
          <Form className='flex flex-wrap gap-x-8 gap-y-4' onSubmit={handleEditModalSubmit}>
            {rowEdit &&
              Object.entries(rowEdit).map((attribute) => {
                return (
                  <Form.Group>
                    <Form.Label>{attribute[0]}</Form.Label>
                    <Form.Control placeholder={attribute[1]} name={attribute[0]} />
                  </Form.Group>
                );
              })}
            <Button variant='primary' type='submit'>
              Submit
            </Button>
            <Button variant='secondary' onClick={handleModalClose}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={rowAdd} centered size='lg' onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add tuple in {selectedTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='flex flex-wrap gap-x-6 gap-y-8 ' onSubmit={handleAddModalSubmit}>
            {rowAdd &&
              Object.entries(rowAdd).map((attribute) => {
                return (
                  <Form.Group>
                    <Form.Label>{attribute[1]}</Form.Label>
                    <Form.Control name={attribute[1]} />
                  </Form.Group>
                );
              })}
            <Button variant='primary' type='submit'>
              Submit
            </Button>
            <Button variant='secondary' onClick={handleModalClose}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={rowDelete} centered onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove tuple in {selectedTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this row?</Modal.Body>
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
