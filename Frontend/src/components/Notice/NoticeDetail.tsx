import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetNoticeQuery } from '../services/noticeApi';

const NoticeDetail: React.FC = () => {
  const { id } = useParams();
  const { data: notice, isLoading } = useGetNoticeQuery(id!);

  return (
    <div className="p-6">
      <Link 
        to="/notices" 
        className="inline-flex items-center text-blue-600 mb-4"
      >
        ← Back to Notices
      </Link>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : notice ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{notice.title}</h1>
              <p className="text-gray-500">
                Created on {new Date(notice.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {notice.priority}
            </span>
          </div>
          
          <div className="prose max-w-none mt-6">
            <p>{notice.content}</p>
          </div>
          
          <div className="mt-8 border-t pt-4">
            <h3 className="font-semibold mb-2">Recipients</h3>
            <div className="flex flex-wrap gap-2">
              {notice.recipients.map(recipient => (
                <span 
                  key={recipient._id} 
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {recipient.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>Notice not found</div>
      )}
    </div>
  );
};

export default NoticeDetail;