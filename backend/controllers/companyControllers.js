const db = require('../models/db');

// Create a new company
const createCompany = (req, res) => {
  const { company_name, contact_person_name, contact_person_email, contact_person_mobile, company_address } = req.body;

  // Check if all required fields are provided
  if (!company_name || !contact_person_name || !contact_person_email || !contact_person_mobile || !company_address) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `
    INSERT INTO companies (company_name, contact_person_name, contact_person_email, contact_person_mobile, company_address)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;

  // Use parameterized query with array of values
  db.query(query, [company_name, contact_person_name, contact_person_email, contact_person_mobile, company_address], (err, results) => {
    if (err) {
      console.error('Failed to save company details: ', err);
      return res.status(500).json({ error: 'Failed to save company details.' });
    }
    return res.status(201).json({ message: 'Company added successfully.', company: results.rows[0] });
  });
};

// Get all companies
const getAllCompanies = (req, res) => {
  const query = 'SELECT * FROM companies';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch companies: ', err);
      return res.status(500).json({ error: 'Failed to fetch companies.' });
    }
    return res.status(200).json({ companies: results.rows });
  });
};

// Get a single company by ID
const getCompanyById = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM companies WHERE id = $1';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Failed to fetch company: ', err);
      return res.status(500).json({ error: 'Failed to fetch company.' });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    return res.status(200).json({ company: results.rows[0] });
  });
};

// Update a company by ID
const updateCompany = (req, res) => {
  const { id } = req.params;
  const { company_name, contact_person_name, contact_person_email, contact_person_mobile, company_address } = req.body;

  // Check if all fields are provided
  if (!company_name || !contact_person_name || !contact_person_email || !contact_person_mobile || !company_address) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `
    UPDATE companies 
    SET 
      company_name = $1, 
      contact_person_name = $2, 
      contact_person_email = $3, 
      contact_person_mobile = $4, 
      company_address = $5
    WHERE id = $6 RETURNING *;
  `;

  db.query(query, [company_name, contact_person_name, contact_person_email, contact_person_mobile, company_address, id], (err, results) => {
    if (err) {
      console.error('Failed to update company details: ', err);
      return res.status(500).json({ error: 'Failed to update company details.' });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    return res.status(200).json({ message: 'Company updated successfully.', company: results.rows[0] });
  });
};

// Delete a company by ID
const deleteCompany = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM companies WHERE id = $1 RETURNING *';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Failed to delete company: ', err);
      return res.status(500).json({ error: 'Failed to delete company.' });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    return res.status(200).json({ message: 'Company deleted successfully.', company: results.rows[0] });
  });
};

module.exports = { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany };
