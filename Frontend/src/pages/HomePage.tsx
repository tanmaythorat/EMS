import React, { useState } from 'react';
import { ChevronRight, Users, Calendar, Briefcase, BarChart, CheckCircle, Menu, X } from 'lucide-react';

const HRMSLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">HRMS</span>
              <span className="ml-2 text-gray-500 font-medium">Systems</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">Benefits</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Get Started</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Request Demo
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-blue-600 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <a href="#features" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                Features
              </a>
              <a href="#benefits" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                Benefits
              </a>
              <a href="#pricing" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                Pricing
              </a>
              <a href="#testimonials" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                Testimonials
              </a>
              <a href="/login" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                Get Started
              </a>
              <button className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Request Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="md:flex md:items-center md:space-x-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Simplify Your HR Management with Our Comprehensive HRMS Solution
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Streamline your recruitment, onboarding, attendance, payroll, and performance evaluations with our intuitive HRMS platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors">
                Get Started <ChevronRight size={20} className="ml-2" />
              </a>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:w-1/2">
            <img 
              src="https://powerslides.com/wp-content/uploads/2022/02/HR-Dashboard-Template-4.png" 
              alt="HRMS Dashboard" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Comprehensive HR Features</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our HRMS platform offers a complete suite of tools designed to streamline your HR operations and enhance employee experience.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <Users className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">Employee Management</h3>
              <p className="mt-2 text-gray-600">
                Centralize all employee data, documents, and communications in one secure location.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <Calendar className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">Attendance & Leave</h3>
              <p className="mt-2 text-gray-600">
                Track attendance, manage leave requests, and monitor time-off balances effortlessly.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <Briefcase className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">Recruitment</h3>
              <p className="mt-2 text-gray-600">
                Streamline your hiring process from job posting to onboarding new employees.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <BarChart className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">Performance Management</h3>
              <p className="mt-2 text-gray-600">
                Set goals, conduct reviews, and provide continuous feedback to employees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Our HRMS Solution?</h2>
              <div className="mt-8 space-y-6">
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Increased Efficiency</h3>
                    <p className="mt-1 text-gray-600">Automate repetitive tasks and reduce manual paperwork by up to 80%.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Data-Driven Decisions</h3>
                    <p className="mt-1 text-gray-600">Access real-time analytics and reports to make informed HR decisions.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Improved Compliance</h3>
                    <p className="mt-1 text-gray-600">Stay compliant with labor laws and regulations with automated updates.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Enhanced Employee Experience</h3>
                    <p className="mt-1 text-gray-600">Empower employees with self-service options and transparent processes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 md:mt-0 md:w-1/2">
              <img 
                src="https://static.vecteezy.com/system/resources/thumbnails/020/685/858/small_2x/analyst-working-on-business-analytics-dashboard-with-kpi-charts-and-metrics-to-analyze-data-and-create-insight-reports-for-executives-and-strategical-decisions-operations-and-performance-management-photo.jpg" 
                alt="HR Benefits" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your organization's size and needs.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Starter Plan */}
            <div 
              className={`border ${hoveredPlan === 'starter' ? 'border-blue-400' : 'border-gray-200'} rounded-lg p-8 bg-white shadow-sm transition-all duration-300 transform ${hoveredPlan === 'starter' ? 'scale-105 shadow-md' : ''}`}
              onMouseEnter={() => setHoveredPlan('starter')}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <h3 className={`text-2xl font-bold ${hoveredPlan === 'starter' ? 'text-blue-600' : 'text-gray-900'} transition-colors duration-300`}>Starter</h3>
              <p className="mt-4 text-gray-600">Perfect for small businesses just getting started with HR management.</p>
              <p className="mt-6 text-4xl font-bold text-gray-900">$9<span className="text-xl text-gray-500">/user/mo</span></p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Employee Management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Attendance Tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Leave Management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Basic Reports</span>
                </li>
              </ul>
              <a href="/login" className={`mt-8 w-full ${hoveredPlan === 'starter' ? 'bg-blue-600' : 'bg-gray-900'} text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 block text-center`}>
                Get Started
              </a>
            </div>

            {/* Professional Plan */}
            <div 
              className={`border-2 ${hoveredPlan === 'professional' ? 'border-blue-600 shadow-lg' : 'border-blue-600'} rounded-lg p-8 bg-white shadow-md relative transition-all duration-300 transform ${hoveredPlan === 'professional' ? 'scale-105' : ''}`}
              onMouseEnter={() => setHoveredPlan('professional')}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-blue-600">Professional</h3>
              <p className="mt-4 text-gray-600">Comprehensive solution for growing businesses with advanced HR needs.</p>
              <p className="mt-6 text-4xl font-bold text-gray-900">$19<span className="text-xl text-gray-500">/user/mo</span></p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Everything in Starter</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Performance Management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Recruitment Tools</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Advanced Analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Employee Self-Service Portal</span>
                </li>
              </ul>
              <a href="/login" className="mt-8 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors block text-center">
                Get Started
              </a>
            </div>

            {/* Enterprise Plan */}
            <div 
              className={`border ${hoveredPlan === 'enterprise' ? 'border-blue-400' : 'border-gray-200'} rounded-lg p-8 bg-white shadow-sm transition-all duration-300 transform ${hoveredPlan === 'enterprise' ? 'scale-105 shadow-md' : ''}`}
              onMouseEnter={() => setHoveredPlan('enterprise')}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <h3 className={`text-2xl font-bold ${hoveredPlan === 'enterprise' ? 'text-blue-600' : 'text-gray-900'} transition-colors duration-300`}>Enterprise</h3>
              <p className="mt-4 text-gray-600">Tailored solutions for large organizations with complex HR requirements.</p>
              <p className="mt-6 text-4xl font-bold text-gray-900">Custom</p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Everything in Professional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Custom Integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Dedicated Account Manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">24/7 Priority Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-gray-600">Advanced Security Features</span>
                </li>
              </ul>
              <button className={`mt-8 w-full ${hoveredPlan === 'enterprise' ? 'bg-blue-600' : 'bg-gray-900'} text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300`}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Trusted by companies of all sizes to manage their HR operations efficiently.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic">
                "Implementing this HRMS solution has transformed our HR department. We've reduced administrative work by 70% and can focus on strategic initiatives."
              </p>
              <div className="mt-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600">HR Director, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic">
                "The employee self-service portal has been a game-changer. Our team loves the transparency and ease of managing their own information and requests."
              </p>
              <div className="mt-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Michael Chen</h4>
                  <p className="text-gray-600">CEO, GrowthStartup</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 italic">
                "The analytics and reporting features have given us insights we never had before. We can now make data-driven decisions about our workforce."
              </p>
              <div className="mt-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Jessica Rodriguez</h4>
                  <p className="text-gray-600">People Ops Manager, GlobalRetail</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Transform Your HR Operations?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of companies that have streamlined their HR processes with our comprehensive HRMS solution.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
            <a href="/login" className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium block">
              Get Started
            </a>
            <button className="border border-white text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-xl font-bold">HRMS Systems</h3>
              <p className="mt-4 text-gray-400">
                Simplifying human resource management for businesses worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-lg">Product</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-lg">Resources</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-lg">Company</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} HRMS Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HRMSLandingPage;