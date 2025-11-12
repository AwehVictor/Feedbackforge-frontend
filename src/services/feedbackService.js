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
};
