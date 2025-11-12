import api from './api';

export const feedbackService = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedbacks', feedbackData);
    return response.data;
  },

  // Get all feedback (for admin)
  getAllFeedback: async () => {
    const response = await api.get('/feedbacks');
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
