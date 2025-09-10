import { useSelector, useDispatch } from 'react-redux';
import { useGetDemoQuery, useLogoutMutation } from './store/authApi';
import { logout } from './store/authSlice';
import type { RootState } from './store/store';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const {
    data: demoData,
    error,
    isLoading,
  } = useGetDemoQuery(undefined, {
    skip: !accessToken,
  });
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
    }
  };

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>
            Access Denied
          </h2>
          <p className='text-gray-600'>
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>
                SRP Dashboard
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>
                Welcome, {user.firstName} {user.lastName}
              </span>
              <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50'
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* User Info Card */}
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                User Information
              </h3>
              <dl className='space-y-2'>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>Name</dt>
                  <dd className='text-sm text-gray-900'>
                    {user.firstName} {user.lastName}
                  </dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>Email</dt>
                  <dd className='text-sm text-gray-900'>{user.email}</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>Role</dt>
                  <dd className='text-sm text-gray-900'>{user.role}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Demo API Data Card */}
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                Demo API Response
              </h3>
              {isLoading && (
                <div className='text-sm text-gray-500'>
                  Loading demo data...
                </div>
              )}
              {error && (
                <div className='text-sm text-red-600'>
                  Error loading demo data:{' '}
                  {(error as any)?.data || 'Unknown error'}
                </div>
              )}
              {demoData && (
                <div className='text-sm text-gray-900'>
                  <pre className='bg-gray-50 p-3 rounded text-xs overflow-auto'>
                    {JSON.stringify(demoData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Token Info Card */}
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                Token Information
              </h3>
              <div className='space-y-2'>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>
                    Access Token (first 20 chars)
                  </dt>
                  <dd className='text-sm text-gray-900 font-mono break-all'>
                    {accessToken?.substring(0, 20)}...
                  </dd>
                </div>
                <div className='text-xs text-gray-500 mt-2'>
                  Note: Access tokens expire after 1 minute in this demo setup.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
