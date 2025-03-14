'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, CheckCircle, XCircle, AlertCircle, 
  Clock, Eye, UserPlus, RefreshCw, Download, Trash2,
  ChevronLeft, ChevronRight, User, Users, Calendar,
  Check, X, MessageSquare, FileText
} from 'lucide-react';
import logger from '@/app/utils/logger';

const Applications = ({ shelterId, darkMode }) => {
  
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
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  
  const notifyApplicationsUpdate = (applications) => {
    const pendingCount = applications.filter(app => app.status === 'pending').length;
    const event = new CustomEvent('applicationsUpdate', { 
      detail: { 
        applications,
        pendingCount
      }
    });
    window.dispatchEvent(event);
  };
  
  const fetchApplications = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }
      
      const response = await fetch(`/api/shelterAdmin/shelter-applications?shelterId=${shelterId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch applications');
      }
      
      const transformedApplications = data.applications.map(app => ({
        id: app._id,
        name: app.name,
        email: app.email,
        phone: app.phone,
        type: app.type,
        urgency: app.urgency,
        status: app.status,
        submittedAt: app.submittedAt,
        lastUpdated: app.lastUpdated,
        notes: app.notes,
        gender: app.gender,
        dob: app.dob,
        language: app.language,
        location: app.location,
        sleepingRough: app.sleepingRough,
        homelessDuration: app.homelessDuration,
        groupType: app.groupType,
        groupSize: app.groupSize,
        childrenCount: app.childrenCount,
        previousAccommodation: app.previousAccommodation,
        reasonForLeaving: app.reasonForLeaving,
        shelterType: app.shelterType,
        securityNeeded: app.securityNeeded,
        curfew: app.curfew,
        communalLiving: app.communalLiving,
        smoking: app.smoking,
        foodAssistance: app.foodAssistance,
        benefitsHelp: app.benefitsHelp,
        mentalHealth: app.mentalHealth,
        substanceUse: app.substanceUse,
        socialServices: app.socialServices,
        domesticAbuse: app.domesticAbuse,
        medicalConditions: app.medicalConditions,
        wheelchair: app.wheelchair,
        immigrationStatus: app.immigrationStatus,
        benefits: app.benefits,
        localConnection: app.localConnection,
        careLeaver: app.careLeaver,
        veteran: app.veteran,
        pets: app.pets,
        petDetails: app.petDetails,
        womenOnly: app.womenOnly,
        lgbtqFriendly: app.lgbtqFriendly,
        supportWorkers: app.supportWorkers,
        supportWorkerDetails: app.supportWorkerDetails,
        terms: app.terms,
        dataConsent: app.dataConsent,
        contactConsent: app.contactConsent
      }));
      
      setApplications(transformedApplications);
      applyFilters(transformedApplications, searchQuery, statusFilter, urgencyFilter);
      
      
      notifyApplicationsUpdate(transformedApplications);
      
      } catch (error) {
        logger.error(error, 'Applications - fetchApplications');
        setError('Failed to load applications');
    } finally {
        setIsLoading(false);
      if (showRefreshIndicator) {
        setIsRefreshing(false);
      }
      }
    };
    
  useEffect(() => {
    if (shelterId) {
    fetchApplications();

      
      const refreshInterval = setInterval(() => {
        fetchApplications();
      }, 15000); 

      
      return () => clearInterval(refreshInterval);
    } else {
      setIsLoading(false);
    }
  }, [shelterId]);
  
  
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
  
  
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await fetch('/api/shelterAdmin/shelter-applications/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          shelterId,
          newStatus,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }
    
    const updatedApplications = applications.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, lastUpdated: new Date().toISOString() } 
          : app
    );
    
    setApplications(updatedApplications);
    
    if (selectedApplication && selectedApplication.id === applicationId) {
      setSelectedApplication({ ...selectedApplication, status: newStatus });
      }

      
      notifyApplicationsUpdate(updatedApplications);

    } catch (error) {
      logger.error(error, 'Applications - handleStatusChange');
      alert('Failed to update application status. Please try again.');
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
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading applications...</p>
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
  
  if (!isLoading && applications.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Applications Management
          </h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => fetchApplications(true)}
              className={`px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg flex items-center`}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 text-center`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <UserPlus className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>
            No Applications Yet
          </h3>
          
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-md mx-auto`}>
            Your shelter hasn't received any applications yet. Applications will appear here when people apply to your shelter through the Safe Haven platform.
          </p>
          
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className="font-medium mb-2">What to Expect</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                When someone applies, you'll receive notifications and can review their details here.
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className="font-medium mb-2">Managing Applications</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You can approve, reject, or waitlist applications, and communicate with applicants directly.
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className="font-medium mb-2">Need Help?</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Contact our support team if you have questions about managing applications.
              </p>
            </div>
          </div>
        </div>
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
                <div className="flex items-center mt-2">
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
                {selectedApplication.notes && (
                  <p className={`mt-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedApplication.notes}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                    <button
                  onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                  className={`inline-flex items-center px-3 py-1 ${
                    darkMode ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-100 text-green-600 hover:bg-green-200'
                  } rounded-lg text-xs`}
                >
                  <CheckCircle size={12} className="mr-1" />
                  Approve
                    </button>
                    <button
                  onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                  className={`inline-flex items-center px-3 py-1 ${
                    darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200'
                  } rounded-lg text-xs`}
                >
                  <XCircle size={12} className="mr-1" />
                  Reject
                    </button>
              </div>
            </div>
            
            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gender</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.gender}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date of Birth</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.dob}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Language</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.language}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Application Type</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.type}</p>
                </div>
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
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.location}</p>
                </div>
              </div>
            </div>
            
            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Housing Situation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sleeping Rough</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.sleepingRough}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Homeless Duration</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.homelessDuration}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Group Type</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.groupType}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Group Size</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.groupSize}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Children Count</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.childrenCount}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Previous Accommodation</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.previousAccommodation}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reason for Leaving</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {Array.isArray(selectedApplication.reasonForLeaving) 
                      ? selectedApplication.reasonForLeaving.join(', ') 
                      : selectedApplication.reasonForLeaving}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shelter Type Needed</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.shelterType}</p>
                </div>
              </div>
            </div>
            
            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Accommodation Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Security Needed</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.securityNeeded}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Curfew Preference</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.curfew}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Communal Living</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.communalLiving}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Smoking Preference</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.smoking}</p>
                </div>
              </div>
            </div>

            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Support Needs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Food Assistance</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.foodAssistance}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Benefits Help</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.benefitsHelp}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mental Health Support</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.mentalHealth}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Substance Use Support</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.substanceUse}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Social Services</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.socialServices}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Domestic Abuse Support</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.domesticAbuse}</p>
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
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.medicalConditions}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wheelchair Access</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {selectedApplication.wheelchair === 'Yes' ? 'Required' : 'Not Required'}
                  </p>
                </div>
              </div>
            </div>

            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Benefits & Immigration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Immigration Status</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.immigrationStatus}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Benefits</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {Array.isArray(selectedApplication.benefits) 
                      ? selectedApplication.benefits.join(', ') 
                      : selectedApplication.benefits}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Local Connection</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {Array.isArray(selectedApplication.localConnection) 
                      ? selectedApplication.localConnection.join(', ') 
                      : selectedApplication.localConnection}
                  </p>
                </div>
              </div>
            </div>
            
            
              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Special Categories
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Care Leaver</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.careLeaver}</p>
              </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Veteran</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.veteran}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Women Only Services</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.womenOnly}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>LGBTQ+ Friendly</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.lgbtqFriendly}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Support Workers</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.supportWorkers}</p>
                </div>
              </div>
            </div>

            
            {selectedApplication.pets === 'Yes' && (
              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Pet Information
                </h3>
                <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                  {selectedApplication.petDetails || 'Details not provided'}
                </p>
              </div>
            )}
            
            
            <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Additional Information
              </h3>
              <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.additionalInfo}</p>
            </div>
            
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Consent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Terms Accepted</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.terms ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Data Processing Consent</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.dataConsent ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact Consent</p>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>{selectedApplication.contactConsent ? 'Yes' : 'No'}</p>
                </div>
              </div>
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
          <button 
            onClick={() => fetchApplications(true)}
            className={`px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg flex items-center`}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
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