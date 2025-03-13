'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, CheckCircle, XCircle, AlertCircle, 
  Clock, Eye, UserPlus, RefreshCw, Download, Trash2,
  ChevronLeft, ChevronRight, User, Users, Calendar,
  Check, X, MessageSquare, FileText
} from 'lucide-react';
import logger from '@/app/utils/logger';

const Applications = ({ applicationData, darkMode }) => {
  
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        
        
        
        
        
        
        
        
        const sampleApplications = [
          {
            id: '1',
            name: 'John Smith',
            email: 'johnsmith@example.com',
            phone: '07712345678',
            type: 'Single Adult',
            urgency: 'URGENT',
            status: 'pending',
            submittedAt: '2025-02-25T14:30:00Z',
            lastUpdated: '2025-02-25T14:30:00Z',
            notes: 'Applicant is currently sleeping rough and requires immediate assistance.',
            gender: 'Male',
            age: 42,
            medicalConditions: 'None reported',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Long-term'
          },
          {
            id: '2',
            name: 'Maria Johnson',
            email: 'maria.j@example.com',
            phone: '07723456789',
            type: 'Family of 3',
            urgency: 'HIGH',
            status: 'approved',
            submittedAt: '2025-02-24T09:15:00Z',
            lastUpdated: '2025-02-26T11:20:00Z',
            notes: 'Family with young children, recently evicted from their home.',
            gender: 'Female',
            age: 35,
            medicalConditions: 'None reported',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Long-term',
            familyMembers: [
              { name: 'James Johnson', relationship: 'Son', age: 8 },
              { name: 'Emily Johnson', relationship: 'Daughter', age: 5 }
            ]
          },
          {
            id: '3',
            name: 'Robert Williams',
            email: 'rob.w@example.com',
            phone: '07734567890',
            type: 'Single Adult',
            urgency: 'MEDIUM',
            status: 'rejected',
            submittedAt: '2025-02-23T16:45:00Z',
            lastUpdated: '2025-02-24T10:30:00Z',
            notes: 'Application rejected as the individual does not meet our criteria for support.',
            gender: 'Male',
            age: 29,
            medicalConditions: 'Asthma',
            needsWheelchairAccess: false,
            hasPets: true,
            petDetails: 'One small dog (Jack Russell)',
            preferredStay: 'Short-term'
          },
          {
            id: '4',
            name: 'Sarah Thompson',
            email: 'sarah.t@example.com',
            phone: '07745678901',
            type: 'Single Adult',
            urgency: 'LOW',
            status: 'waitlisted',
            submittedAt: '2025-02-22T11:20:00Z',
            lastUpdated: '2025-02-23T09:15:00Z',
            notes: 'Currently staying with a friend but arrangement ends in 2 weeks.',
            gender: 'Female',
            age: 26,
            medicalConditions: 'None reported',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Short-term'
          },
          {
            id: '5',
            name: 'David Chen',
            email: 'david.c@example.com',
            phone: '07756789012',
            type: 'Single Adult',
            urgency: 'HIGH',
            status: 'pending',
            submittedAt: '2025-02-21T14:10:00Z',
            lastUpdated: '2025-02-21T14:10:00Z',
            notes: 'Recently released from hospital, needs stable accommodation.',
            gender: 'Male',
            age: 45,
            medicalConditions: 'Diabetes, Recent Surgery',
            needsWheelchairAccess: true,
            hasPets: false,
            preferredStay: 'Long-term'
          },
          {
            id: '6',
            name: 'Emma Wilson',
            email: 'emma.w@example.com',
            phone: '07767890123',
            type: 'Single Parent',
            urgency: 'HIGH',
            status: 'approved',
            submittedAt: '2025-02-20T09:30:00Z',
            lastUpdated: '2025-02-21T16:45:00Z',
            notes: 'Single mother with one child, fleeing domestic violence.',
            gender: 'Female',
            age: 31,
            medicalConditions: 'Anxiety',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Long-term',
            familyMembers: [
              { name: 'Olivia Wilson', relationship: 'Daughter', age: 4 }
            ]
          },
          {
            id: '7',
            name: 'Michael Brown',
            email: 'michael.b@example.com',
            phone: '07778901234',
            type: 'Single Adult',
            urgency: 'MEDIUM',
            status: 'pending',
            submittedAt: '2025-02-19T15:20:00Z',
            lastUpdated: '2025-02-19T15:20:00Z',
            notes: 'Recently lost job and facing eviction at end of month.',
            gender: 'Male',
            age: 37,
            medicalConditions: 'None reported',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Short-term'
          },
          {
            id: '8',
            name: 'Jessica Davis',
            email: 'jessica.d@example.com',
            phone: '07789012345',
            type: 'Single Adult',
            urgency: 'LOW',
            status: 'waitlisted',
            submittedAt: '2025-02-18T10:15:00Z',
            lastUpdated: '2025-02-19T11:30:00Z',
            notes: 'Currently couch surfing, seeking more stable accommodation.',
            gender: 'Female',
            age: 24,
            medicalConditions: 'None reported',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Long-term'
          },
          {
            id: '9',
            name: 'Daniel Taylor',
            email: 'daniel.t@example.com',
            phone: '07790123456',
            type: 'Single Adult',
            urgency: 'HIGH',
            status: 'rejected',
            submittedAt: '2025-02-17T14:45:00Z',
            lastUpdated: '2025-02-18T09:20:00Z',
            notes: 'Application rejected due to previous behavioral issues at other shelters.',
            gender: 'Male',
            age: 41,
            medicalConditions: 'Substance use disorder',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Short-term'
          },
          {
            id: '10',
            name: 'Sophia Martinez',
            email: 'sophia.m@example.com',
            phone: '07801234567',
            type: 'Family of 4',
            urgency: 'URGENT',
            status: 'approved',
            submittedAt: '2025-02-16T09:10:00Z',
            lastUpdated: '2025-02-17T14:30:00Z',
            notes: 'Family lost home in apartment fire, emergency placement needed.',
            gender: 'Female',
            age: 38,
            medicalConditions: 'None reported',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Long-term',
            familyMembers: [
              { name: 'Carlos Martinez', relationship: 'Husband', age: 40 },
              { name: 'Luis Martinez', relationship: 'Son', age: 10 },
              { name: 'Isabella Martinez', relationship: 'Daughter', age: 7 }
            ]
          },
          {
            id: '11',
            name: 'William Harris',
            email: 'william.h@example.com',
            phone: '07812345678',
            type: 'Elderly',
            urgency: 'HIGH',
            status: 'pending',
            submittedAt: '2025-02-15T11:30:00Z',
            lastUpdated: '2025-02-15T11:30:00Z',
            notes: 'Elderly gentleman being discharged from hospital with nowhere to go.',
            gender: 'Male',
            age: 72,
            medicalConditions: 'Arthritis, Heart condition',
            needsWheelchairAccess: true,
            hasPets: false,
            preferredStay: 'Long-term'
          },
          {
            id: '12',
            name: 'Olivia Clark',
            email: 'olivia.c@example.com',
            phone: '07823456789',
            type: 'Single Adult',
            urgency: 'MEDIUM',
            status: 'waitlisted',
            submittedAt: '2025-02-14T15:40:00Z',
            lastUpdated: '2025-02-15T10:25:00Z',
            notes: 'Recently moved to the area for work, temporary accommodation needed until salary begins.',
            gender: 'Female',
            age: 27,
            medicalConditions: 'None reported',
            needsWheelchairAccess: false,
            hasPets: false,
            preferredStay: 'Short-term'
          }
        ];
        
        setApplications(sampleApplications);
        applyFilters(sampleApplications, searchQuery, statusFilter, urgencyFilter);
        
        setIsLoading(false);
      } catch (error) {
        logger.error(error, 'Applications - fetchApplications');
        setError('Failed to load applications');
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [applicationData]);
  
  
  useEffect(() => {
    applyFilters(applications, searchQuery, statusFilter, urgencyFilter);
  }, [applications, searchQuery, statusFilter, urgencyFilter, sortBy]);
  
  const applyFilters = (apps, query, status, urgency) => {
    let filtered = [...apps];
    
    
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(lowercasedQuery) ||
        app.email.toLowerCase().includes(lowercasedQuery) ||
        app.phone.includes(query)
      );
    }
    
    
    if (status !== 'all') {
      filtered = filtered.filter(app => app.status === status);
    }
    
    
    if (urgency !== 'all') {
      filtered = filtered.filter(app => app.urgency.toLowerCase() === urgency.toLowerCase());
    }
    
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case 'oldest':
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        case 'urgency-high':
          const urgencyOrder = { 'URGENT': 3, 'HIGH': 2, 'MEDIUM': 1, 'LOW': 0 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'name-za':
          return b.name.localeCompare(a.name);
        default:
          return new Date(b.submittedAt) - new Date(a.submittedAt);
      }
    });
    
    setFilteredApplications(filtered);
    setCurrentPage(1);
  };
  
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  
  const getTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  };
  
  
  const handleStatusChange = (applicationId, newStatus) => {
    
    
    
    
    
    
    
    
    
    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus, lastUpdated: new Date().toISOString() } : app
    );
    
    setApplications(updatedApplications);
    
    if (selectedApplication && selectedApplication.id === applicationId) {
      setSelectedApplication({ ...selectedApplication, status: newStatus });
    }
  };
  
  
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} ${darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`;
      case 'approved':
        return `${baseClasses} ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`;
      case 'rejected':
        return `${baseClasses} ${darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'}`;
      case 'waitlisted':
        return `${baseClasses} ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'}`;
      default:
        return `${baseClasses} ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`;
    }
  };
  
  
  const getUrgencyBadge = (urgency) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (urgency) {
      case 'URGENT':
        return `${baseClasses} ${darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'}`;
      case 'HIGH':
        return `${baseClasses} ${darkMode ? 'bg-orange-800 text-orange-200' : 'bg-orange-100 text-orange-800'}`;
      case 'MEDIUM':
        return `${baseClasses} ${darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`;
      case 'LOW':
        return `${baseClasses} ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'}`;
      default:
        return `${baseClasses} ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`;
    }
  };
  
  
  const changeStatus = (applicationId, newStatus) => {
    handleStatusChange(applicationId, newStatus);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Error Loading Applications</h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{error}</p>
      </div>
    );
  }
  
  
  if (selectedApplication) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedApplication(null)}
            className={`flex items-center px-4 py-2 ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } rounded-lg text-sm`}
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Applications
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className={`px-3 py-2 rounded-lg text-sm ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } flex items-center`}
            >
              <Download size={14} className="mr-1" /> Export
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} lg:col-span-2 rounded-xl shadow-xl p-6`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {selectedApplication.name}
                </h2>
                <div className="flex items-center mt-1">
                  <span className={getUrgencyBadge(selectedApplication.urgency)}>
                    {selectedApplication.urgency}
                  </span>
                  <span className={`${getStatusBadge(selectedApplication.status)} ml-2`}>
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-3`}>
                    ID: {selectedApplication.id}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {selectedApplication.status === 'pending' && (
                  <>
                    <button
                      onClick={() => changeStatus(selectedApplication.id, 'approved')}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center"
                    >
                      <Check size={14} className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => changeStatus(selectedApplication.id, 'rejected')}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center"
                    >
                      <X size={14} className="mr-1" /> Reject
                    </button>
                    <button
                      onClick={() => changeStatus(selectedApplication.id, 'waitlisted')}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center"
                    >
                      <Clock size={14} className="mr-1" /> Waitlist
                    </button>
                  </>
                )}
                {selectedApplication.status === 'waitlisted' && (
                  <button
                    onClick={() => changeStatus(selectedApplication.id, 'approved')}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center"
                  >
                    <Check size={14} className="mr-1" /> Approve
                  </button>
                )}
                {selectedApplication.status === 'approved' && (
                  <button
                    className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm flex items-center"
                  >
                    <UserPlus size={14} className="mr-1" /> Add as Resident
                  </button>
                )}
              </div>
            </div>
            
            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    <a href={`mailto:${selectedApplication.email}`} className="hover:underline">
                      {selectedApplication.email}
                    </a>
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    <a href={`tel:${selectedApplication.phone}`} className="hover:underline">
                      {selectedApplication.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Application Type</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {selectedApplication.type}
                  </p>
                </div>
              </div>
            </div>
            
            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gender</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {selectedApplication.gender}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Age</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {selectedApplication.age}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Preferred Stay</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {selectedApplication.preferredStay}
                  </p>
                </div>
              </div>
            </div>
            
            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Health & Accessibility
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Medical Conditions</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {selectedApplication.medicalConditions}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wheelchair Access Needed</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {selectedApplication.needsWheelchairAccess ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
            
            
            {selectedApplication.familyMembers && (
              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Family Members
                </h3>
                <table className={`w-full ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <thead>
                    <tr className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      <th className="text-left pb-2 text-sm font-medium">Name</th>
                      <th className="text-left pb-2 text-sm font-medium">Relationship</th>
                      <th className="text-left pb-2 text-sm font-medium">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedApplication.familyMembers.map((member, index) => (
                      <tr key={index}>
                        <td className="py-1">{member.name}</td>
                        <td className="py-1">{member.relationship}</td>
                        <td className="py-1">{member.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            
            {selectedApplication.hasPets && (
              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Pet Information
                </h3>
                <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                  {selectedApplication.petDetails || 'Has pets (details not provided)'}
                </p>
              </div>
            )}
            
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Notes
              </h3>
              <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                {selectedApplication.notes}
              </p>
            </div>
          </div>
          
          
          <div className="space-y-6">
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6`}>
              <h3 className={`text-md font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Application Timeline
              </h3>
              <div className="relative border-l-2 border-gray-300 ml-3 pl-6 space-y-6">
                <div className="relative">
                  <div className={`absolute -left-8 w-4 h-4 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-500'} border-4 ${darkMode ? 'border-gray-800' : 'border-white'}`}></div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Application Submitted</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(selectedApplication.submittedAt)} ({getTimeSince(selectedApplication.submittedAt)})
                  </p>
                </div>
                
                {selectedApplication.status !== 'pending' && (
                  <div className="relative">
                    <div className={`absolute -left-8 w-4 h-4 rounded-full ${
                      selectedApplication.status === 'approved' ? 'bg-green-500' :
                      selectedApplication.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    } border-4 ${darkMode ? 'border-gray-800' : 'border-white'}`}></div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {selectedApplication.status === 'approved' ? 'Application Approved' :
                        selectedApplication.status === 'rejected' ? 'Application Rejected' : 'Added to Waitlist'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(selectedApplication.lastUpdated)} ({getTimeSince(selectedApplication.lastUpdated)})
                    </p>
                  </div>
                )}
              </div>
              
              {selectedApplication.status === 'pending' && (
                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50'} flex items-start`}>
                  <Clock className={`flex-shrink-0 mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} size={18} />
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>Pending Review</p>
                    <p className={`text-xs ${darkMode ? 'text-yellow-200 text-opacity-80' : 'text-yellow-600'}`}>
                      This application needs a decision
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6`}>
              <h3 className={`text-md font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg text-sm text-left flex items-center`}>
                  <MessageSquare className={`mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={16} />
                  <span className={darkMode ? 'text-white' : 'text-gray-800'}>Send Message</span>
                </button>
                
                <button className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg text-sm text-left flex items-center`}>
                  <FileText className={`mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} size={16} />
                  <span className={darkMode ? 'text-white' : 'text-gray-800'}>Request Documents</span>
                </button>
                
                <button className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg text-sm text-left flex items-center`}>
                  <Calendar className={`mr-3 ${darkMode ? 'text-green-400' : 'text-green-500'}`} size={16} />
                  <span className={darkMode ? 'text-white' : 'text-gray-800'}>Schedule Interview</span>
                </button>
                
                <button className={`w-full px-4 py-3 ${darkMode ? 'bg-red-900 hover:bg-red-800 text-red-100' : 'bg-red-50 hover:bg-red-100 text-red-800'} rounded-lg text-sm text-left flex items-center`}>
                  <Trash2 className="mr-3" size={16} />
                  <span>Delete Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Applications Management
        </h1>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg flex items-center`}>
            <RefreshCw size={16} className="mr-2" /> Refresh
          </button>
        </div>
      </div>
      
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6 mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="relative">
            <Search className={`absolute left-3 top-2.5 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 w-full py-2 px-3 border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          
          
          <div className="relative">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full py-2 px-3 border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="waitlisted">Waitlisted</option>
            </select>
          </div>
          
          
          <div className="relative">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Urgency
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className={`w-full py-2 px-3 border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Urgency Levels</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          
          <div className="relative">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full py-2 px-3 border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="newest">Date (Newest First)</option>
              <option value="oldest">Date (Oldest First)</option>
              <option value="urgency-high">Urgency (Highest First)</option>
              <option value="name-az">Name (A-Z)</option>
              <option value="name-za">Name (Z-A)</option>
            </select>
          </div>
        </div>
        
        
        <div className="flex flex-wrap mt-4">
          {(searchQuery || statusFilter !== 'all' || urgencyFilter !== 'all') && (
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`}>
              Active Filters:
            </div>
          )}
          
          {searchQuery && (
            <div className={`${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} rounded-full px-3 py-1 text-xs flex items-center mr-2 mb-2`}>
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-blue-600">×</button>
            </div>
          )}
          
          {statusFilter !== 'all' && (
            <div className={`${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'} rounded-full px-3 py-1 text-xs flex items-center mr-2 mb-2`}>
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-green-600">×</button>
            </div>
          )}
          
          {urgencyFilter !== 'all' && (
            <div className={`${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'} rounded-full px-3 py-1 text-xs flex items-center mr-2 mb-2`}>
              Urgency: {urgencyFilter.charAt(0).toUpperCase() + urgencyFilter.slice(1)}
              <button onClick={() => setUrgencyFilter('all')} className="ml-1 hover:text-red-600">×</button>
            </div>
          )}
          
          {(searchQuery || statusFilter !== 'all' || urgencyFilter !== 'all') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setUrgencyFilter('all');
              }}
              className={`text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} mb-2`}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl overflow-hidden mb-6`}>
        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className={`h-10 w-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-4`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>No Applications Found</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Applicant
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Type
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Urgency
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Submitted
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {currentItems.map(application => (
                  <tr 
                    key={application.id}
                    className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full ${
                          darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-500'
                        } flex items-center justify-center`}>
                          <User size={16} />
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {application.name}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {application.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {application.type.includes('Family') ? (
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {application.type}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          {application.type}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getUrgencyBadge(application.urgency)}>
                        {application.urgency}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      <div>{formatDate(application.submittedAt)}</div>
                      <div className="text-xs opacity-70">{getTimeSince(application.submittedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button 
                        onClick={() => viewApplicationDetails(application)}
                        className={`inline-flex items-center px-3 py-1 ${
                          darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        } rounded-lg text-xs`}
                      >
                        <Eye size={12} className="mr-1" />
                        View
                      </button>
                      
                      {application.status === 'pending' && (
                        <button 
                          onClick={() => changeStatus(application.id, 'approved')}
                          className={`inline-flex items-center px-3 py-1 ${
                            darkMode ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-100 text-green-600 hover:bg-green-200'
                          } rounded-lg text-xs`}
                        >
                          <CheckCircle size={12} className="mr-1" />
                          Approve
                        </button>
                      )}
                      
                      {application.status === 'pending' && (
                        <button 
                          onClick={() => changeStatus(application.id, 'rejected')}
                          className={`inline-flex items-center px-3 py-1 ${
                            darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200'
                          } rounded-lg text-xs`}
                        >
                          <XCircle size={12} className="mr-1" />
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {filteredApplications.length > 0 && (
        <div className="flex justify-between items-center pb-6">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Showing {Math.min(filteredApplications.length, indexOfFirstItem + 1)}-{Math.min(indexOfLastItem, filteredApplications.length)} of {filteredApplications.length} applications
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg flex items-center ${
                currentPage === 1 ? 
                  (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed') :
                  (darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
              }`}
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Previous</span>
            </button>
            
            <button
              onClick={() => setCurrentPage(currentPage < Math.ceil(filteredApplications.length / itemsPerPage) ? currentPage + 1 : currentPage)}
              disabled={currentPage >= Math.ceil(filteredApplications.length / itemsPerPage)}
              className={`px-3 py-1 rounded-lg flex items-center ${
                currentPage >= Math.ceil(filteredApplications.length / itemsPerPage) ? 
                  (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed') :
                  (darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
              }`}
            >
              <span className="mr-1">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;