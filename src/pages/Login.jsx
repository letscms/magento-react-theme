import React from 'react'
import Loginforms from '../components/forms/Loginforms'
import CustomerRegisteredForm from '../components/forms/CustomerRegisteredForm'


function Login() {
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

      <div className="flex flex-col md:flex-row gap-8 justify-center">
       
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <Loginforms  />
          </div>
        </div>

       
        <div className="w-full md:w-1/2 lg:w-1/3 mt-8 md:mt-0">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
            <CustomerRegisteredForm />
          </div>
        </div>
      </div>
    </main>
    </>
  )
}

export default Login