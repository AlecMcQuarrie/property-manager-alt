import Link from 'next/link';
import { Building2, Users, CreditCard, Wrench, FileText, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#101a2b]">
      {/* Navigation */}
      <nav className="bg-[#181c23] shadow-sm border-b border-[#22304a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold tracking-tight text-blue-400 select-none">SuiteProp</span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/auth"
                className="text-[#e5e7eb] hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/hero.jpg"
            alt="Modern apartment buildings"
            fill
            priority
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left text-[#e5e7eb]">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Modern Property</span>{' '}
                  <span className="block text-blue-300 xl:inline">Management</span>
                </h1>
                <p className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Streamline your property management with our comprehensive platform. 
                  Manage units, handle maintenance requests, and process payments all in one place.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/auth"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-[#181c23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-[#e5e7eb] sm:text-4xl">
              Everything you need to manage properties
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
              Our platform provides comprehensive tools for property managers and residents alike.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative bg-[#22304a] rounded-lg p-6 shadow">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-[#e5e7eb]">Unit Management</p>
                <p className="mt-2 ml-16 text-base text-gray-400">
                  Track unit status, manage leases, and monitor occupancy rates with our comprehensive unit management system.
                </p>
              </div>

              <div className="relative bg-[#22304a] rounded-lg p-6 shadow">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-[#e5e7eb]">Resident Portal</p>
                <p className="mt-2 ml-16 text-base text-gray-400">
                  Give residents easy access to pay bills, submit maintenance requests, and view their lease information.
                </p>
              </div>

              <div className="relative bg-[#22304a] rounded-lg p-6 shadow">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <CreditCard className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-[#e5e7eb]">Payment Processing</p>
                <p className="mt-2 ml-16 text-base text-gray-400">
                  Streamline rent collection and utility payments with our integrated payment processing system.
                </p>
              </div>

              <div className="relative bg-[#22304a] rounded-lg p-6 shadow">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Wrench className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-[#e5e7eb]">Maintenance Tracking</p>
                <p className="mt-2 ml-16 text-base text-gray-400">
                  Track maintenance requests from submission to completion with priority-based scheduling.
                </p>
              </div>

              <div className="relative bg-[#22304a] rounded-lg p-6 shadow">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-[#e5e7eb]">Document Management</p>
                <p className="mt-2 ml-16 text-base text-gray-400">
                  Store and manage leases, contracts, and important documents securely in the cloud.
                </p>
              </div>

              <div className="relative bg-[#22304a] rounded-lg p-6 shadow">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-[#e5e7eb]">Admin Dashboard</p>
                <p className="mt-2 ml-16 text-base text-gray-400">
                  Comprehensive admin portal with analytics, reporting, and management tools for property managers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-[#e5e7eb] sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Try our demo today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Experience the power of modern property management with our comprehensive demo.
          </p>
          <Link
            href="/auth"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-100 bg-blue-700 hover:bg-blue-600 sm:w-auto"
          >
            Sign In to Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#181c23]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-2xl font-extrabold tracking-tight text-blue-400 select-none">SuiteProp</span>
            <p className="mt-4 text-base text-gray-400">
              SuiteProp Demo - A comprehensive property management solution
            </p>
            <p className="mt-2 text-sm text-gray-500">
              This is a demo application showcasing modern property management features.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
