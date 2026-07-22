import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { IconMail, IconLock, IconUser, IconUserPlus } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import api from '../../../utils/api';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      // Send real POST request to backend
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'CLIENT', // By default for this demo, new users are clients (team owners)
      });
      
      const userData = response.data;
      
      // The backend returns { token, name, email, role }
      login(userData, false);
      toast.success("Account created successfully!");
      navigate('/client/dashboard');
    } catch (error) {
      console.error("Signup failed", error);
      toast.error(error.response?.data?.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-secondary-900 p-10 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Join AuctXI
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600 dark:text-secondary-400">
            Create your Team Owner account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
                  <IconUser size={18} />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2.5 pl-10 border border-secondary-300 dark:border-secondary-700 placeholder-secondary-400 text-secondary-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-secondary-800 transition-shadow"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
                  <IconMail size={18} />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="appearance-none relative block w-full px-3 py-2.5 pl-10 border border-secondary-300 dark:border-secondary-700 placeholder-secondary-400 text-secondary-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-secondary-800 transition-shadow"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
                  <IconLock size={18} />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="appearance-none relative block w-full px-3 py-2.5 pl-10 border border-secondary-300 dark:border-secondary-700 placeholder-secondary-400 text-secondary-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-secondary-800 transition-shadow"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
                  <IconLock size={18} />
                </div>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="appearance-none relative block w-full px-3 py-2.5 pl-10 border border-secondary-300 dark:border-secondary-700 placeholder-secondary-400 text-secondary-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-secondary-800 transition-shadow"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <IconUserPlus className="h-5 w-5 text-primary-500 group-hover:text-primary-400" aria-hidden="true" />
              </span>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
          
          <div className="text-center text-sm text-secondary-600 dark:text-secondary-400 mt-4">
            Already have an account? <a href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
