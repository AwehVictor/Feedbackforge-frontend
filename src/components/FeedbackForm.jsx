import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { MessageSquare, ArrowRight, Info, Star } from 'lucide-react';
import { toast } from 'sonner';
import { feedbackService } from '../services/feedbackService';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branches = [
    'Ikeja Branch',
    'Surulere Branch',
    'Victoria Island Branch',
    'Lekki Branch',
    'Yaba Branch',
    'Abeokuta Branch',
    'Ibadan Branch',
    'Ilorin Branch',
    'Abuja Branch',
    'Port Harcourt Branch',
    'Enugu Branch',
    'Kano Branch',
    'Kaduna Branch',
    'Akure Branch',
    'Osogbo Branch',
  ];

  const serviceTypes = [
    'Branch Visit',
    'Mobile App',
    'ATM Service',
    'Online Banking',
    'Customer Service Call',
    'USSD Banking',
    'POS Transaction',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!formData.serviceType) {
      toast.error('Please select a service type');
      return;
    }
    
    if (formData.rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    if (!formData.comment) {
      toast.error('Please add your comments');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await feedbackService.submitFeedback(formData);
      toast.success('Feedback submitted successfully! Thank you for your input.');
      
      // Reset form
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        serviceType: '',
        branch: '',
        rating: 0,
        comment: ''
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit feedback. Please try again.';
      toast.error(message);
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="inline-block p-4 bg-accent rounded-md mb-4 shadow-lg">
            <MessageSquare className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            We Value Your Feedback
          </h1>
          <p className="text-foreground/70 text-lg">
            Help us serve you better by sharing your experience
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-card rounded-md shadow-2xl p-6 sm:p-8 lg:p-10 border border-border">
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-foreground text-sm font-bold">1</span>
              Personal Information
            </h2>
            
            <div className="space-y-5">
              {/* Customer Name */}
              <div className="group">
                <Label htmlFor="customerName" className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-accent">*</span>
                </Label>
                <Input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground 
                           focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                           placeholder:text-muted-foreground group-hover:border-primary/50"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                  <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address <span className="text-accent">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground 
                             focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                             placeholder:text-muted-foreground group-hover:border-primary/50"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="group">
                  <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number <span className="text-accent">*</span>
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground 
                             focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                             placeholder:text-muted-foreground group-hover:border-primary/50"
                    placeholder="07062873635"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-foreground text-sm font-bold">2</span>
              Service Details
            </h2>
            
            <div className="space-y-5">
              {/* Service Type */}
              <div className="group">
                <Label htmlFor="serviceType" className="block text-sm font-medium text-foreground mb-2">
                  Service Type <span className="text-accent">*</span>
                </Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}
                  required
                >
                  <SelectTrigger className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground 
                           focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                           group-hover:border-primary/50">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Branch */}
              <div className="group">
                <Label htmlFor="branch" className="block text-sm font-medium text-foreground mb-2">
                  Branch/Location <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select
                  value={formData.branch}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, branch: value }))}
                >
                  <SelectTrigger className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground 
                           focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                           group-hover:border-primary/50">
                    <SelectValue placeholder="Select a branch (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-foreground text-sm font-bold">3</span>
              Your Rating
            </h2>
            
            <div className="bg-linear-to-br from-background to-muted p-6 rounded-md border-2 border-border">
              <p className="text-center text-foreground mb-4 font-medium">
                How would you rate your experience? <span className="text-accent">*</span>
              </p>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRatingClick(index)}
                    onMouseEnter={() => setHoveredRating(index)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`p-2 transition-all duration-300 transform hover:scale-110 cursor-pointer rounded-full
                              ${formData.rating === index ? 'scale-110' : ''}`}
                  >
                    <Star
                      className={`w-12 h-12 transition-all duration-300
                                ${(hoveredRating >= index || formData.rating >= index) 
                                  ? 'fill-accent text-accent' 
                                  : 'text-muted-foreground'}`}
                    />
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
              <span className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-foreground text-sm font-bold">4</span>
              Additional Comments
            </h2>
            
            <div className="group">
              <Label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                Tell us more about your experience <span className="text-accent">*</span>
              </Label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground 
                         focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300
                         placeholder:text-muted-foreground group-hover:border-primary/50 resize-none"
                placeholder="Share your thoughts, suggestions, or any details that would help us improve our service..."
              />
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Your feedback helps us improve our services
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative p-8 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg
                       shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-primary/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
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
