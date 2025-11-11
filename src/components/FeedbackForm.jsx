import { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    serviceType: '',
    branch: '',
    rating: 0,
    comment: ''
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  const serviceTypes = [
    'Mobile App',
    'Web Application',
    'Customer Support',
    'Product Quality',
    'Delivery Service',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    // Add your submission logic here
  };

  const getRatingEmoji = (index) => {
    const emojis = ['😞', '😕', '😐', '😊', '🤩'];
    return emojis[index - 1];
  };

  const getRatingLabel = (index) => {
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return labels[index - 1];
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-accent rounded-2xl mb-4 shadow-lg">
            <svg 
              className="w-12 h-12 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            We Value Your Feedback
          </h1>
          <p className="text-foreground/70 text-lg">
            Help us serve you better by sharing your experience
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-border">
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-foreground text-sm font-bold">1</span>
              Personal Information
            </h2>
            
            <div className="space-y-5">
              {/* Customer Name */}
              <div className="group">
                <label htmlFor="customerName" className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground 
                           focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                           placeholder:text-muted-foreground group-hover:border-primary/50"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground 
                             focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                             placeholder:text-muted-foreground group-hover:border-primary/50"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number <span className="text-accent">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground 
                             focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                             placeholder:text-muted-foreground group-hover:border-primary/50"
                    placeholder="08012345678"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-foreground text-sm font-bold">2</span>
              Service Details
            </h2>
            
            <div className="space-y-5">
              {/* Service Type */}
              <div className="group">
                <label htmlFor="serviceType" className="block text-sm font-medium text-foreground mb-2">
                  Service Type <span className="text-accent">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground 
                           focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                           group-hover:border-primary/50 cursor-pointer"
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div className="group">
                <label htmlFor="branch" className="block text-sm font-medium text-foreground mb-2">
                  Branch/Location <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground 
                           focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                           placeholder:text-muted-foreground group-hover:border-primary/50"
                  placeholder="Enter branch or location"
                />
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-foreground text-sm font-bold">3</span>
              Your Rating
            </h2>
            
            <div className="bg-linear-to-br from-background to-muted p-6 rounded-2xl border-2 border-border">
              <p className="text-center text-foreground mb-4 font-medium">
                How would you rate your experience? <span className="text-accent">*</span>
              </p>
              
              <div className="flex justify-center gap-3 mb-4">
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRatingClick(index)}
                    onMouseEnter={() => setHoveredRating(index)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`text-5xl transition-all duration-300 transform hover:scale-125 cursor-pointer
                              ${(hoveredRating >= index || formData.rating >= index) ? 'grayscale-0' : 'grayscale opacity-30'}
                              ${formData.rating === index ? 'scale-125 animate-bounce' : ''}`}
                  >
                    {getRatingEmoji(index)}
                  </button>
                ))}
              </div>

              {formData.rating > 0 && (
                <p className="text-center text-primary font-semibold text-lg animate-fade-in">
                  {getRatingLabel(formData.rating)}
                </p>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-foreground text-sm font-bold">4</span>
              Additional Comments
            </h2>
            
            <div className="group">
              <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                Tell us more about your experience <span className="text-accent">*</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground 
                         focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                         placeholder:text-muted-foreground group-hover:border-primary/50 resize-none"
                placeholder="Share your thoughts, suggestions, or any details that would help us improve our service..."
              />
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Your feedback helps us improve our services
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg
                       shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-primary/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Submit Feedback
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            🔒 Your information is secure and will only be used to improve our services
          </p>
        </form>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <p className="text-foreground/60 text-sm">
            Thank you for taking the time to share your thoughts with us! 💝
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
