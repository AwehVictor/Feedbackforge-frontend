import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';

export const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                toast.success(result.message || 'Login successful!');
                navigate('/admin');
            } else {
                toast.error(result.error);

            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.log(error,"error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-accent rounded-md mb-4 shadow-lg">
                        <LogIn className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Login to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card rounded-md shadow-2xl p-6 sm:p-8 border border-border">
                    <div className="space-y-5">
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email Address <span className="text-accent">*</span>
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password <span className="text-accent">*</span>
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 py-6 text-lg font-semibold"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};