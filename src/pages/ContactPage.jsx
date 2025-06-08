import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center">Contact Us</h1>
          <p className="text-xl text-center mt-4 max-w-3xl mx-auto">
            We'd love to hear from you. Please fill out the form below or use
            our contact information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaMapMarkerAlt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3 text-gray-700">
                    <h3 className="text-lg font-medium">Our Location</h3>
                    <p className="mt-1">
                      1/19. First Floor. In- front of Central Bank. Naurangabad,
                      G T Road, Aligarh 202001, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaPhone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3 text-gray-700">
                    <h3 className="text-lg font-medium">Phone</h3>
                    <p className="mt-1">
                      <a
                        href="tel:+14155550123"
                        className="hover:text-blue-600"
                      >
                        +91 9717478599
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3 text-gray-700">
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className="mt-1">
                      <a
                        href="mailto:contact@yourcompany.com"
                        className="hover:text-blue-600"
                      >
                        {" "}
                        info@letscms.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaClock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3 text-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Business Hours
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed">
                      Saturday - Thursday: 9:30am - 6:30pm
                      <br />
                      Friday:{" "}
                      <span className="font-medium text-red-600">Closed</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Send Us a Message
              </h2>

              {submitSuccess && (
                <div
                  className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Success!</strong>
                  <span className="block sm:inline">
                    {" "}
                    Your message has been sent. We'll get back to you soon.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md ${
                          formErrors.name ? "border-red-300" : ""
                        }`}
                      />
                      {formErrors.name && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md ${
                          formErrors.email ? "border-red-300" : ""
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md ${
                          formErrors.subject ? "border-red-300" : ""
                        }`}
                      />
                      {formErrors.subject && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className={`py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md ${
                          formErrors.message ? "border-red-300" : ""
                        }`}
                      />
                      {formErrors.message && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Our Location
            </h2>
            <div className="h-96 w-full bg-gray-200 rounded-lg overflow-hidden">
              {/* Replace with actual map component or iframe */}
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3526.8234287300966!2d78.0876367761276!3d27.876693876085948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a50a7a6d9663%3A0x158fd1bf181fac08!2sLETSCMS%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1748334418119!5m2!1sen!2sin"
                  width="600"
                  height="450"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  What are your business hours?
                </h3>
                <p className="mt-2 text-gray-600">
                  Our office is open Monday through Friday from 9am to 5pm, and
                  Saturday from 10am to 2pm. We are closed on Sundays and major
                  holidays.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  How quickly do you respond to inquiries?
                </h3>
                <p className="mt-2 text-gray-600">
                  We strive to respond to all inquiries within 24 business
                  hours. For urgent matters, please call our office directly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Do you offer virtual meetings?
                </h3>
                <p className="mt-2 text-gray-600">
                  Yes, we offer virtual meetings via Zoom, Google Meet, or
                  Microsoft Teams. Please indicate your preference when
                  scheduling a meeting.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Is there parking available at your office?
                </h3>
                <p className="mt-2 text-gray-600">
                  Yes, we have free parking available for clients in the lot
                  behind our building. Please use the visitor spaces marked with
                  our company name.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
