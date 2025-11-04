import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NoticeForm.css';

interface Employee {
  _id: string;
  name: string;
  email: string;
  department?: string;
  position?: string;
}

const NoticeForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    end_date: '',
    recipientEmails: [] as string[]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Check form validity whenever form data changes
  useEffect(() => {
    const isValid = 
      formData.title.trim() !== '' && 
      formData.content.trim() !== '' && 
      formData.end_date !== '' && 
      formData.recipientEmails.length > 0;
    setIsFormValid(isValid);
  }, [formData]);

  // Search employees
  const searchEmployees = async (query: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(
        import.meta.env.VITE_API_BASE_URL+ `/api/notices/employees?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error searching employees:', err);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(() => {
        searchEmployees(searchTerm);
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      end_date: e.target.value
    }));
  };

  const handleAddEmployee = (employee: Employee) => {
    if (!selectedEmployees.some(e => e._id === employee._id)) {
      setSelectedEmployees(prev => [...prev, employee]);
      setFormData(prev => ({
        ...prev,
        recipientEmails: [...prev.recipientEmails, employee.email]
      }));
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    const employeeToRemove = selectedEmployees.find(e => e._id === employeeId);
    if (employeeToRemove) {
      setSelectedEmployees(prev => prev.filter(e => e._id !== employeeId));
      setFormData(prev => ({
        ...prev,
        recipientEmails: prev.recipientEmails.filter(email => email !== employeeToRemove.email)
      }));
    }
  };

  const handleManualEmailAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.includes('@')) {
      const email = searchTerm.trim();
      if (!formData.recipientEmails.includes(email)) {
        setFormData(prev => ({
          ...prev,
          recipientEmails: [...prev.recipientEmails, email]
        }));
        setSearchTerm('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL+ '/api/notices',
        {
          title: formData.title,
          content: formData.content,
          recipientEmails: formData.recipientEmails,
          end_date: formData.end_date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/notices');
      }, 1500);
    } catch (err) {
      console.error('Error creating notice:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to create notice. Please try again.'
      );
      
      if (err.response?.data?.missingEmails) {
        setError(`The following emails were not found: ${err.response.data.missingEmails.join(', ')}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notice-form-container">
      <h2>Create New Notice</h2>
      
      {success && (
        <div className="success-message">
          <p>Notice created successfully!</p>
          <p>Redirecting to notices list...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="notice-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter notice title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={5}
              placeholder="Enter notice content"
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">Expiration Date</label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Recipients</label>
            <div className="recipient-selection">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleManualEmailAdd}
                placeholder="Search employees by name or email (or enter email manually)"
              />
              
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(employee => (
                    <div 
                      key={employee._id} 
                      className="search-result-item"
                      onClick={() => handleAddEmployee(employee)}
                    >
                      <span className="employee-name">{employee.name}</span>
                      <span className="employee-email">{employee.email}</span>
                      {employee.department && (
                        <span className="employee-department">{employee.department}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="selected-recipients">
                {selectedEmployees.map(employee => (
                  <div key={employee._id} className="recipient-tag">
                    {employee.name} ({employee.email})
                    <button 
                      type="button" 
                      onClick={() => handleRemoveEmployee(employee._id)}
                      className="remove-recipient"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.recipientEmails
                  .filter(email => !selectedEmployees.some(e => e.email === email))
                  .map(email => (
                    <div key={email} className="recipient-tag">
                      {email}
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          recipientEmails: prev.recipientEmails.filter(e => e !== email)
                        }))}
                        className="remove-recipient"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard/notices')}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid || loading}
            >
              {loading ? 'Creating...' : 'Create Notice'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NoticeForm;
