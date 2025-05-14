import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Pagination } from "@mui/material";
import axios from "axios";

import { deleteTransactions, editTransactions, getTransactions } from "../../utils/ApiRequest";
import "./home.css";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currId, setCurrId] = useState(null);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const rowsPerPage = 5;

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    method: "",
    subcategory: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditClick = (itemKey) => {
    const editTran = transactions.find((item) => item._id === itemKey);
    if (editTran) {
      setCurrId(itemKey);
      setValues({
        title: editTran.title,
        amount: editTran.amount,
        description: editTran.description,
        category: editTran.category,
        subcategory: editTran.subcategory,
        method: editTran.method,
        date: moment(editTran.date).format("YYYY-MM-DD"),
        transactionType: editTran.transactionType,
      });
      handleShow();
    }
  };

 


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${editTransactions}/${currId}`, values);
      if (data.success === true) {
        handleClose();
       
      } else {
        console.error("Edit failed");
      }
    } catch (err) {
      console.error("Edit error", err);
    }
  };

  const handleDeleteClick = async (itemKey) => {
    try {
      const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
        userId: user._id,
        // transaction: itemKey,
      });
      if (data.success === true) {
   
      } else {
        console.error("Delete failed");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data, props.user]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const currentTransactions = transactions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Container>
      <Table responsive="md" className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Method</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {currentTransactions.map((item) => (
            <tr key={item._id}>
              <td>{moment(item.date).format("YYYY-MM-DD")}</td>
              <td>{item.title}</td>
              <td>{item.amount}</td>
              <td>{item.transactionType}</td>
              <td>{item.category}</td>
              <td>{item.subcategory}</td>
              <td>{item.method}</td>
              <td>
                <div className="d-flex gap-2 justify-content-center">
                  <EditNoteIcon
                    sx={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => handleEditClick(item._id)}
                  />
                  <DeleteForeverIcon
                    sx={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeleteClick(item._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(transactions.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            backgroundColor: '#f0f0f0',
            color: '#3f51b5',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            '&.Mui-selected': {
              backgroundColor: '#3f51b5',
              color: '#fff',
            },
          },
        }}
      />

      {/* Edit Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={values.category}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subcategory</Form.Label>
              <Form.Control
                type="text"
                name="subcategory"
                value={values.subcategory}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Method</Form.Label>
              <Form.Control
                type="text"
                name="method"
                value={values.method}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                name="transactionType"
                value={values.transactionType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TableData;


