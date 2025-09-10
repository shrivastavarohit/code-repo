import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { useRegisterMutation } from './store/authApi';
import { setCredentials } from './store/authSlice';

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
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
    confirmPassword: z.string(),
    role: z.enum(['USER', 'ADMIN']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'USER',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError('');
      const { confirmPassword, ...registerData } = data;
      const result = await register(registerData).unwrap();

      // Create user object from registration data
      const user = {
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: registerData.role,
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
      setServerError(error?.data?.message || 'Registration failed');
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
      <div className='relative z-10 flex flex-col items-center justify-center flex-1 py-8'>
        <div className='bg-[#d90429]/90 rounded-xl shadow-lg p-8 w-[400px] flex flex-col items-center'>
          <div className='mb-4'>
            <span className='text-4xl font-bold text-white tracking-wide'>
              SRP
            </span>
          </div>
          <h2 className='text-2xl font-semibold text-white mb-6'>Sign Up</h2>
          <form
            className='w-full flex flex-col gap-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='flex gap-2'>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='First Name'
                  {...registerField('firstName')}
                  className='w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-[#d90429]'
                />
                {errors.firstName && (
                  <p className='text-xs text-yellow-300 mt-1'>
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Last Name'
                  {...registerField('lastName')}
                  className='w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-[#d90429]'
                />
                {errors.lastName && (
                  <p className='text-xs text-yellow-300 mt-1'>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                type='email'
                placeholder='Email'
                {...registerField('email')}
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
                {...registerField('password')}
                className='w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-[#d90429]'
              />
              {errors.password && (
                <p className='text-xs text-yellow-300 mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <input
                type='password'
                placeholder='Confirm Password'
                {...registerField('confirmPassword')}
                className='w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-[#d90429]'
              />
              {errors.confirmPassword && (
                <p className='text-xs text-yellow-300 mt-1'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...registerField('role')}
                className='w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-[#d90429]'
              >
                <option value='USER'>User</option>
                <option value='ADMIN'>Admin</option>
              </select>
              {errors.role && (
                <p className='text-xs text-yellow-300 mt-1'>
                  {errors.role.message}
                </p>
              )}
            </div>
            <button
              type='submit'
              className='w-full py-2 rounded bg-[#d90429] text-white font-bold text-lg shadow hover:bg-[#b90323] transition'
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
            {serverError && (
              <p className='text-xs text-yellow-300 text-center mt-2'>
                {serverError}
              </p>
            )}
          </form>
          <div className='mt-4 text-center'>
            <span className='text-white text-xs'>Already have an account?</span>
            <button
              onClick={() => (window.location.href = '/login')}
              className='ml-1 text-[#ffb703] text-xs font-bold hover:underline'
            >
              Sign In
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
