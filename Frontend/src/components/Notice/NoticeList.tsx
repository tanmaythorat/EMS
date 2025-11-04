import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NoticeList.css';

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

const NoticeList: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(import.meta.env.VITE_API_BASE_URL+ '/api/notices/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          activeOnly: true // Only fetch active notices
        }
      });

      setNotices(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch notices');
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      setDeleteLoading(noticeId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(import.meta.env.VITE_API_BASE_URL+ `/api/notices/${noticeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh the notices list
      await fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete notice');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNotice(expandedNotice === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const navigateToEdit = (noticeId: string) => {
    navigate(`/dashboard/notices/${noticeId}/edit`);
  };

  const navigateToCreate = () => {
    navigate('/dashboard/notices/new');
  };

  

  if (loading) {
    return (
      <div className="notice-list-container">
        <div className="loading-spinner"></div>
        <p>Loading notices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notice-list-container">
        <div className="error-message">
          <p>Error: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-list-container">
      <div className="notice-list-header-container">
        <h2 className="notice-list-header">Company Notices</h2>
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={navigateToCreate}
          >
            <i className="fas fa-plus"></i> Create New
          </button>
          
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="empty-state">
          <h3>No Active Notices Available</h3>
          <p>There are currently no active notices to display.</p>
          <button 
            className="btn btn-primary"
            onClick={navigateToCreate}
          >
            Create Your First Notice
          </button>
        </div>
      ) : (
        <div className="notice-list">
          {notices.map((notice) => (
            <div 
              key={notice._id} 
              className={`notice-card ${expandedNotice === notice._id ? 'expanded' : ''}`}
            >
              <div 
                className="notice-card-header"
                onClick={() => toggleExpand(notice._id)}
              >
                <h3 className="notice-title">{notice.title}</h3>
                <span className={`status-badge ${notice.is_active ? 'active' : 'inactive'}`}>
                  {notice.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div 
                className="notice-meta"
                onClick={() => toggleExpand(notice._id)}
              >
                <span className="meta-item">
                  <i className="fas fa-user"></i> {notice.created_by.name}
                </span>
                <span className="meta-item">
                  <i className="fas fa-calendar-alt"></i> {formatDate(notice.start_date)}
                </span>
                {notice.end_date && (
                  <span className="meta-item">
                    <i className="fas fa-calendar-times"></i> Expires: {formatDate(notice.end_date)}
                  </span>
                )}
              </div>

              <div 
                className="notice-content"
                onClick={() => toggleExpand(notice._id)}
              >
                <p>{notice.content}</p>
              </div>

              {expandedNotice === notice._id && (
                <div className="notice-details">
                  <div className="recipients-section">
                    <h4>Recipients:</h4>
                    <div className="recipients-list">
                      {notice.recipients.map(recipient => (
                        <span key={recipient._id} className="recipient-tag">
                          {recipient.name} ({recipient.email})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="notice-footer">
                    <span className="created-at">
                      Created: {formatDate(notice.createdAt)}
                    </span>
                    <div className="notice-actions">
                      <button 
                        className="btn btn-edit"
                        onClick={() => navigateToEdit(notice._id)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button 
                        className="btn btn-delete"
                        onClick={() => handleDeleteNotice(notice._id)}
                        disabled={deleteLoading === notice._id}
                      >
                        {deleteLoading === notice._id ? (
                          <><i className="fas fa-spinner fa-spin"></i> Deleting...</>
                        ) : (
                          <><i className="fas fa-trash"></i> Delete</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeList;