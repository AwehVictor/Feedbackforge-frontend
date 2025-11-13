import api from './api';

export const feedbackService = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedbacks', feedbackData);
    return response.data;
  },

  // Get all feedback (for admin)
  getAllFeedback: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/feedbacks${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    const response = await api.get(`/feedbacks/${id}`);
    return response.data;
  },

  // Delete feedback
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedbacks/${id}`);
    return response.data;
  },

  // Update feedback status
  updateFeedbackStatus: async (id, status) => {
    const response = await api.patch(`/feedbacks/${id}`, { status });
    return response.data;
  },

  // Analytics Endpoints
  // Get sentiment overview
  getSentimentOverview: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/sentiment-overview${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get service type performance
  getServicePerformance: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/service-metrics${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get sentiment trends
  getSentimentTrends: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/trends${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get category insights
  getCategoryInsights: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/categories${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get emotion analysis
  getEmotionAnalysis: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/emotions${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get urgency dashboard
  getUrgencyDashboard: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/urgency${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get pulse metrics (CSAT, NPS, CES)
  getPulseMetrics: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/pulse${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get actionable insights
  getActionableInsights: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/insights${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get branch comparison
  getBranchComparison: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
    ).toString();
    const response = await api.get(`/analytics/branches${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },
};
