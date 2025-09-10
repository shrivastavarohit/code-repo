import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { useLoginMutation } from './store/authApi';
import { setCredentials } from './store/authSlice';

const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character',
    }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState('');
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');
      const result = await login(data).unwrap();

      // Create user object from login data for now
      // In a real app, this would come from the JWT token or separate API call
      const user = {
        email: data.email,
        firstName: 'User',
        lastName: 'Name',
        role: 'USER' as const,
      };

      dispatch(
        setCredentials({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: user,
        })
      );
      // Redirect to dashboard on success
      window.location.href = '/dashboard';
    } catch (error: any) {
      setServerError(error?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='min-h-screen bg-[#d90429] flex flex-col justify-center relative'>
      <div className='absolute inset-0 z-0'>
        <div className='w-full h-full flex items-center justify-center'>
          <img
            src='/image.jpg'
            alt='background'
            className='object-cover w-full h-full opacity-80'
          />
        </div>
      </div>
      <div className='relative z-10 flex flex-col items-center justify-center flex-1'>
        <div className='bg-[#d90429]/90 rounded-xl shadow-lg p-8 w-[350px] flex flex-col items-center'>
          <div className='mb-4'>
            <span className='text-4xl font-bold text-white tracking-wide'>
              SRP
            </span>
          </div>
          <h2 className='text-2xl font-semibold text-white mb-6'>Sign In</h2>
          <form
            className='w-full flex flex-col gap-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                type='email'
                placeholder='Email'
                {...register('email')}
                className='w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-[#d90429]'
              />
              {errors.email && (
                <p className='text-xs text-yellow-300 mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                type='password'
                placeholder='Password'
                {...register('password')}
                className='w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-[#d90429]'
              />
              {errors.password && (
                <p className='text-xs text-yellow-300 mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type='submit'
              className='w-full py-2 rounded bg-[#d90429] text-white font-bold text-lg shadow hover:bg-[#b90323] transition'
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            {serverError && (
              <p className='text-xs text-yellow-300 text-center mt-2'>
                {serverError}
              </p>
            )}
          </form>
          <div className='mt-4 text-center'>
            <span className='text-white text-xs'>Don't have an account?</span>
            <button
              onClick={() => (window.location.href = '/register')}
              className='ml-1 text-[#ffb703] text-xs font-bold hover:underline'
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
      <footer className='w-full flex flex-row justify-between items-center px-8 py-2 text-white text-xs bg-[#d90429] fixed bottom-0 left-0'>
        <div className='flex flex-row gap-4 items-center'>
          <a href='#' className='text-white text-xl'>
            <FaInstagram />
          </a>
          <a href='#' className='text-white text-xl'>
            <FaFacebook />
          </a>
          <a href='#' className='text-white text-xl'>
            <FaLinkedin />
          </a>
        </div>
        <span>© All rights reserved | NitaCo Ltd. 2025</span>
        <span>
          Crafted with <span className='text-red-400'>♥</span> in Switzerland.
        </span>
      </footer>
    </div>
  );
}
