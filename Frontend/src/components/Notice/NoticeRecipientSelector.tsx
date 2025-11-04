import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoticeRecipientSelector.css';

interface Employee {
  _id: string;
  name: string;
  email: string;
  empId: string;
  department?: string;
  position?: string;
}

interface NoticeRecipientSelectorProps {
  onSelect: (emails: string[]) => void;
  selectedEmails: string[];
}

const NoticeRecipientSelector: React.FC<NoticeRecipientSelectorProps> = ({ 
  onSelect, 
  selectedEmails 
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (searchTerm.length > 2 || searchTerm.length === 0) {
        setIsLoading(true);
        setError(null);
        try {
          const res = await axios.get(`/api/notices/employees?search=${searchTerm}`);
          setEmployees(res.data);
        } catch (err) {
          setError('Failed to fetch employees');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchEmployees();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelect = (employee: Employee) => {
    const newSelected = selectedEmails.includes(employee.email)
      ? selectedEmails.filter(email => email !== employee.email)
      : [...selectedEmails, employee.email];
    onSelect(newSelected);
  };

  return (
    <div className="recipient-selector-container">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Select Recipients</h3>
            <button 
              className="btn btn-light btn-sm"
              onClick={() => navigate('/notices/new')}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Form
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="search-container mb-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search employees by name, email or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {isLoading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="employee-list">
              {employees.length > 0 ? (
                employees.map(employee => (
                  <div
                    key={employee._id}
                    className={`employee-card ${selectedEmails.includes(employee.email) ? 'selected' : ''}`}
                    onClick={() => handleSelect(employee)}
                  >
                    <div className="employee-avatar">
                      <span className="initials">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="employee-details">
                      <h5 className="employee-name">{employee.name}</h5>
                      <div className="employee-meta">
                        <span className="employee-email">
                          <i className="bi bi-envelope me-1"></i>
                          {employee.email}
                        </span>
                        <span className="employee-id">
                          <i className="bi bi-person-badge me-1"></i>
                          {employee.empId}
                        </span>
                        {employee.department && (
                          <span className="employee-dept">
                            <i className="bi bi-building me-1"></i>
                            {employee.department}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="selection-indicator">
                      {selectedEmails.includes(employee.email) ? (
                        <i className="bi bi-check-circle-fill text-success"></i>
                      ) : (
                        <i className="bi bi-circle text-muted"></i>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted">
                  {searchTerm ? 'No employees found' : 'Start typing to search employees'}
                </div>
              )}
            </div>
          )}

          {selectedEmails.length > 0 && (
            <div className="selected-summary mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Selected Recipients</h5>
                <span className="badge bg-primary rounded-pill">
                  {selectedEmails.length}
                </span>
              </div>
              <div className="selected-emails">
                {selectedEmails.map(email => (
                  <span key={email} className="badge bg-light text-dark me-1 mb-1">
                    {email}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeRecipientSelector;