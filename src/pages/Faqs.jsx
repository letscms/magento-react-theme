import React, { useState } from "react";
import Herobanner from "../utils/Herobanner";
import Featurebox from "../utils/Featurebox";
import Loader from "../utils/Loader";
import { Link } from "react-router-dom";

function Faqs() {
  const [activeTab, setActiveTab] = useState("mlm");
  const [localLoading, setLocalLoading] = useState(false);

  const banners = [
    {
      title: "Powerful MLM Solutions",
      subtitle: "Scalable multi-level marketing platforms built for growth",
      // buttonText: "Explore Plans",
      // buttonLink: "https://www.mlmtrees.com/free-demo/",
      image: "https://source.unsplash.com/1600x600/?network,teamwork",
      bg: "bg-gradient-to-r from-blue-600 to-violet-600",
    },
    {
      title: "Magento + React Ecommerce",
      subtitle: "Modern headless commerce with Magento backend and React frontend",
      // buttonText: "Learn More",
      // // buttonLink: "/technology",
      image: "https://source.unsplash.com/1600x600/?code,technology",
      bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
    }
  ];

  const mlmPlans = [
    {
      title: "Unilevel Plan",
      description: "Simple structure with unlimited direct referrals earning you commissions on each level",
      benefits: [
        "Unlimited width in your downline",
        "Fastest way to earn from direct referrals",
        "Easy to understand and explain"
      ],
      icon: "👥",
      link: "https://www.mlmtrees.com/product/unilevel-mlm-plan-magento/"
    },
    {
      title: "Binary Plan",
      description: "Two-legged structure that pays based on your weaker team's performance",
      benefits: [
        "Balanced team growth",
        "Focus on building depth",
        "Higher earning potential"
      ],
      icon: "⚖️",
      link: "https://www.mlmtrees.com/free-demo/"
    },
    {
      title: "Matrix Plan",
      description: "Fixed-width structure that automatically places new members in your downline",
      benefits: [
        "Controlled growth",
        "Automatic spillover benefits",
        "Predictable structure"
      ],
      icon: "🔢",
      link: "https://www.mlmtrees.com/free-demo/"
    }
  ];

  const techFeatures = [
    {
      title: "Magento Backend",
      description: "Robust ecommerce functionality with product management, orders, and payments",
      icon: "fas fa-shopping-cart",
      iconColor: "text-orange-500"
    },
    {
      title: "React Frontend",
      description: "Fast, modern user interface with excellent performance and user experience",
      icon: "fab fa-react",
      iconColor: "text-blue-400"
    },
    {
      title: "Headless Architecture",
      description: "Best-of-breed solutions with API-driven flexibility",
      icon: "fas fa-plug",
      iconColor: "text-purple-500"
    },
    {
      title: "Progressive Web App",
      description: "App-like experience with offline capabilities and push notifications",
      icon: "fas fa-mobile-alt",
      iconColor: "text-green-500"
    }
  ];

  const benefits = [
    {
      icon: "fas fa-rocket",
      iconColor: "text-red-500",
      title: "High Performance",
      description: "Lightning-fast page loads with React's virtual DOM"
    },
    {
      icon: "fas fa-gem",
      iconColor: "text-blue-500",
      title: "Scalability",
      description: "Handle high traffic volumes with Magento's enterprise architecture"
    },
    {
      icon: "fas fa-tools",
      iconColor: "text-gray-700",
      title: "Flexibility",
      description: "Easily customize and extend functionality"
    },
    {
      icon: "fas fa-chart-line",
      iconColor: "text-green-500",
      title: "Better Conversions",
      description: "Modern UX that drives more sales"
    }
  ];

  const features = [
    {
      icon: "fas fa-trophy",
      iconColor: "text-yellow-500",
      title: "Industry Experts",
      description: "10+ years experience in MLM and ecommerce"
    },
    {
      icon: "fas fa-lock",
      iconColor: "text-blue-500",
      title: "Secure Platform",
      description: "Enterprise-grade security and compliance"
    },
    {
      icon: "fas fa-bolt",
      iconColor: "text-amber-500",
      title: "Fast Implementation",
      description: "Get up and running in weeks, not months"
    },
    {
      icon: "fas fa-sync",
      iconColor: "text-green-500",
      title: "Ongoing Support",
      description: "Dedicated team for maintenance and updates"
    }
  ];

  // New data for Magento+React section
  const magentoReactBenefits = [
    {
      title: "Faster Page Loads",
      description: "React's virtual DOM delivers up to 10x faster page loads than traditional storefronts, reducing bounce rates by up to 40%.",
      icon: "fas fa-tachometer-alt",
      iconColor: "text-red-500",
      stat: "10x"
    },
    {
      title: "Higher Conversion Rates",
      description: "Smooth, app-like shopping experiences lead to 35% higher conversion rates compared to traditional ecommerce sites.",
      icon: "fas fa-chart-line",
      iconColor: "text-green-500",
      stat: "+35%"
    },
    {
      title: "Enterprise Reliability",
      description: "Magento's robust backend handles peak traffic periods with 99.99% uptime, even during major sales events.",
      icon: "fas fa-shield-alt",
      iconColor: "text-blue-500",
      stat: "99.99%"
    },
    {
      title: "Mobile Optimization",
      description: "PWA capabilities provide native-app experiences on mobile, where 67% of ecommerce traffic now originates.",
      icon: "fas fa-mobile-alt",
      iconColor: "text-purple-500",
      stat: "67%"
    }
  ];

  const businessChallenges = [
    {
      challenge: "Slow site performance",
      solution: "React's optimized rendering",
      icon: "fas fa-hourglass-half"
    },
    {
      challenge: "Poor mobile experience",
      solution: "Progressive Web App capabilities",
      icon: "fas fa-mobile-alt"
    },
    {
      challenge: "Limited customization",
      solution: "Headless architecture flexibility",
      icon: "fas fa-puzzle-piece"
    },
    {
      challenge: "Complex inventory management",
      solution: "Magento's enterprise inventory system",
      icon: "fas fa-boxes"
    },
    {
      challenge: "Scaling difficulties",
      solution: "API-first architecture that scales",
      icon: "fas fa-expand-arrows-alt"
    },
    {
      challenge: "High development costs",
      solution: "Reusable components & faster development",
      icon: "fas fa-coins"
    }
  ];

  return (
    <div className="home-page bg-gray-50">
      {/* Hero Banner */}
      <Herobanner banners={banners} />
      
      {/* Why Magento+React Section - NEW SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-lg font-bold">NEXT-GEN ECOMMERCE</span>
            <h2 className="text-4xl font-bold mt-4 text-gray-800">Why Your Business Needs <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Magento + React</span></h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
            <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-lg">
              In today's competitive digital marketplace, businesses need more than just a standard online store. 
              The Magento + React combination delivers the perfect balance of robust backend capabilities and 
              lightning-fast frontend experiences.
            </p>
          </div>

          {/* Key Benefits with Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {magentoReactBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -right-4 -top-4 bg-blue-100 rounded-full w-24 h-24 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <i className={`${benefit.icon} ${benefit.iconColor} text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                  <div className="text-3xl font-bold text-blue-600">{benefit.stat}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Business Challenges & Solutions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 shadow-lg animate-fade-in">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Common Ecommerce Challenges</h3>
                <p className="text-gray-600 mb-8">
                  Today's online retailers face numerous obstacles that traditional ecommerce platforms struggle to solve effectively.
                  Our Magento + React solution addresses these key pain points:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {businessChallenges.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="bg-white p-2 rounded-full shadow-md mr-4">
                        <i className={`${item.icon} text-blue-500`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.challenge}</h4>
                        <p className="text-sm text-gray-600">Solved by: {item.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">The Perfect Technology Stack</h3>
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fab fa-magento text-2xl text-orange-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Magento</h4>
                      <p className="text-sm text-gray-600">Enterprise-grade backend</p>
                    </div>
                  </div>
                  <ul className="space-y-2 pl-16">
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Advanced product management
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Robust order processing
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Enterprise-level security
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fab fa-react text-2xl text-blue-500"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">React</h4>
                      <p className="text-sm text-gray-600">Modern frontend experience</p>
                    </div>
                  </div>
                  <ul className="space-y-2 pl-16">
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Lightning-fast page loads
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Responsive mobile-first design
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      App-like user experience
                    </li>
                  </ul>
                </div>
              </div>
            </div>           
            
          </div>
        </div>
      </section>
      
      {/* Info Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-10">
            <div className="bg-white p-1 rounded-full shadow-md">
              <button
                className={`px-8 py-3 font-medium rounded-full transition-all duration-300 ${
                  activeTab === "mlm" 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("mlm")}
              >
                MLM Solutions
              </button>
              <button
                className={`px-8 py-3 font-medium rounded-full transition-all duration-300 ${
                  activeTab === "tech" 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("tech")}
              >
                Technology Stack
              </button>
            </div>
          </div>
          
          {activeTab === "mlm" ? (
            <div className="grid md:grid-cols-3 gap-8">
              {mlmPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-5xl mb-6">{plan.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{plan.title}</h3>
                  <p className="mb-6 text-gray-600">{plan.description}</p>
                  <ul className="mb-8 space-y-3">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                      ))}
                    </ul>
                  <a
                    href={plan.link}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    Learn More
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12">
              <div
                className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in-left"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Magento + React Architecture</h3>
                <p className="mb-8 text-gray-600">
                  Our solution combines the power of Magento's robust ecommerce backend with 
                  React's modern frontend capabilities to deliver exceptional performance 
                  and user experience.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {techFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <i className={`${feature.icon} ${feature.iconColor} text-xl`}></i>
                      </div>
                      <h4 className="font-bold mb-2 text-gray-800">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in-right"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Key Benefits</h3>
                <ul className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <li 
                      key={index} 
                      className="flex items-start animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0">
                        <i className={`${benefit.icon} ${benefit.iconColor} text-xl`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">{benefit.title}</h4>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials/CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="mb-10 max-w-2xl mx-auto text-blue-100 text-lg">
              Whether you need a powerful MLM platform or a modern ecommerce solution, 
              we have the technology and expertise to help you succeed.
            </p>
            <div className="space-x-4">
              <a
                href="https://www.mlmtrees.com/"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
              </a>
             
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-12 animate-fade-in-up"
          >
            <span className="bg-blue-100 text-blue-600 text-sm font-medium px-4 py-1 rounded-full">WHY CHOOSE US</span>
            <h2 className="text-3xl font-bold mt-4 text-gray-800">We Deliver Excellence</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className={`${feature.icon} ${feature.iconColor} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">7+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Faqs;