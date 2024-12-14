import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import for jwt-decode
import { useNavigate } from 'react-router-dom';
import './company.css'; // Importing the CSS file for styling

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    company_name: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_mobile: '',
    company_address: ''
  });
  const [userName, setUserName] = useState('');
  const [isEdit, setIsEdit] = useState(false);  // To track if we are editing a company
  const [editCompanyId, setEditCompanyId] = useState(null);  // Store the ID of the company to edit
  const navigate = useNavigate();

  // Fetch all companies and user data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/companies');
        setCompanies(response.data.companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    // Fetch user data from the token
    console.log(localStorage)
    const name = localStorage.getItem('userName'); // Assuming you saved the token in localStorage
    if (name) {
      try {
        // const decodedToken = jwtDecode(userToken); // Decode JWT token to get user info
        console.log("Name: ",name);
        setUserName(name); // Set the user's name from the token
      } catch (error) {
        console.error('Error decoding name:', error);
      }
    }

    fetchCompanies();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany({ ...newCompany, [name]: value });
  };

  // Create new company
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/api/companies/create', newCompany);
      setNewCompany({
        company_name: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_mobile: '',
        company_address: ''
      });
      // Refresh company list after adding
      const response = await axios.get('http://localhost:3002/api/companies');
      setCompanies(response.data.companies);
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  // Edit an existing company
  const handleEditCompany = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3002/api/companies/${id}`);
      const company = response.data.company;
      setNewCompany({
        company_name: company.company_name,
        contact_person_name: company.contact_person_name,
        contact_person_email: company.contact_person_email,
        contact_person_mobile: company.contact_person_mobile,
        company_address: company.company_address
      });
      setEditCompanyId(id);
      setIsEdit(true);  // Set edit mode to true
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  // Update company details
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3002/api/companies/${editCompanyId}`, newCompany);
      setNewCompany({
        company_name: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_mobile: '',
        company_address: ''
      });
      setIsEdit(false);  // Exit edit mode
      setEditCompanyId(null);
      // Refresh company list after update
      const response = await axios.get('http://localhost:3002/api/companies');
      setCompanies(response.data.companies);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  // Handle delete company
  const handleDeleteCompany = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/companies/${id}`);
      // Refresh company list after deletion
      const response = await axios.get('http://localhost:3002/api/companies');
      setCompanies(response.data.companies);
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  return (
    <div className="company-container">
      <h1>Welcome, {userName || 'Guest'}</h1>
      <h2>{isEdit ? 'Update Company' : 'Add New Company'}</h2>
      <form onSubmit={isEdit ? handleUpdateCompany : handleCreateCompany} className="company-form">
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={newCompany.company_name}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="contact_person_name"
          placeholder="Contact Person Name"
          value={newCompany.contact_person_name}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="email"
          name="contact_person_email"
          placeholder="Contact Person Email"
          value={newCompany.contact_person_email}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="contact_person_mobile"
          placeholder="Contact Person Mobile"
          value={newCompany.contact_person_mobile}
          onChange={handleInputChange}
          className="input-field"
        />
        <textarea
          name="company_address"
          placeholder="Company Address"
          value={newCompany.company_address}
          onChange={handleInputChange}
          className="input-field"
        />
        <button type="submit" className="submit-btn">{isEdit ? 'Update Company' : 'Create Company'}</button>
      </form>

      <h2>All Companies</h2>
      <table className="company-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Contact Person Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        {companies ?
        <tbody>
          {companies.map(company => (
            <tr key={company.id}>
              <td>{company.company_name}</td>
              <td>{company.contact_person_name}</td>
              <td>{company.contact_person_email}</td>
              <td>{company.contact_person_mobile}</td>
              <td>{company.company_address}</td>
              <td>
                <button onClick={() => handleEditCompany(company.id)} className="edit-btn">Edit</button>
                <button onClick={() => handleDeleteCompany(company.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
         :"Nothing to display"}
      </table>
    </div>
  );
};

export default Company;
