import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './NoticeEdit.css';

interface User {
  _id: string;
  name: string;
  email?: string;
}

interface Notice {
  _id: string;
  title: string;
  content: string;
  created_by: User;
  companyName: string;
  recipients: User[];
  is_active: boolean;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
}

const NoticeEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_active: true,
    start_date: '',
    end_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`http://localhost:5000/api/notices/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setNotice(response.data);
        setFormData({
          title: response.data.title,
          content: response.data.content,
          is_active: response.data.is_active,
          start_date: response.data.start_date.split('T')[0],
          end_date: response.data.end_date ? response.data.end_date.split('T')[0] : ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch notice');
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const updatedNotice = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null
      };

      await axios.put(`http://localhost:5000/api/notices/${id}`, updatedNotice, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/dashboard/notices', { state: { noticeUpdated: true } });
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to update notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/notices');
  };

  if (loading) {
    return (
      <div className="notice-edit-container">
        <div className="loading-spinner"></div>
        <p>Loading notice details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notice-edit-container">
        <div className="error-message">
          <p>Error: {error}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard/notices')}>
            Back to Notices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-edit-container">
      <div className="edit-header">
        <h2>Edit Notice</h2>
        <p className="text-muted">Update the details of your company notice</p>
      </div>

      <form onSubmit={handleSubmit} className="notice-edit-form">
        <div className="mb-4">
          <label htmlFor="title" className="form-label">Notice Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="form-label">Notice Content</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows={6}
            value={formData.content}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="start_date" className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="end_date" className="form-label">End Date (Optional)</label>
            <input
              type="date"
              className="form-control"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              min={formData.start_date}
            />
          </div>
        </div>

        <div className="mb-4 form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="is_active">Active Notice</label>
        </div>

        {notice && (
          <div className="mb-4">
            <label className="form-label">Recipients</label>
            <div className="recipients-display">
              {notice.recipients.map(recipient => (
                <span key={recipient._id} className="recipient-badge">
                  {recipient.name} {recipient.email && `<${recipient.email}>`}
                </span>
              ))}
            </div>
          </div>
        )}

        {submitError && (
          <div className="alert alert-danger mb-4">
            {submitError}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              'Update Notice'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeEdit;