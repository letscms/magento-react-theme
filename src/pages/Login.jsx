import React, { useState } from 'react';
import LoginForm from '../components/forms/Loginforms';
import CustomerRegisteredForm from '../components/forms/CustomerRegisteredForm';

function Login() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-500 hover:text-indigo-600">
                  <i className="fas fa-home mr-2"></i>Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-gray-400 mx-2 text-xs"></i>
                  <span className="text-indigo-600">Login</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col items-center">
          {/* Toggle Switch */}
          <div className="mb-8 flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setShowLogin(true)}
              className={`px-6 py-2 rounded-full font-medium ${showLogin ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
            >
              Login
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`px-6 py-2 rounded-full font-medium ${!showLogin ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
            >
              Register
            </button>
          </div>

          {/* Form Container */}
          <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              {showLogin ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>
                  <LoginForm />
                  <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setShowLogin(false)}
                      className="text-indigo-600 hover:underline focus:outline-none"
                    >
                      Register here
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center">Create New Account</h2>
                  <CustomerRegisteredForm />
                  <p className="mt-4 text-center text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={() => setShowLogin(true)}
                      className="text-indigo-600 hover:underline focus:outline-none"
                    >
                      Login here
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;