import React from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Home,
  DollarSign,
  User,
  X
} from 'lucide-react';

interface NavigationItem {
  name: string;
  icon: React.ElementType;
  section: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeSection, setActiveSection }: SidebarProps) {
  const navigation: NavigationItem[] = [
    { name: 'Dashboard', icon: Home, section: 'dashboard' },
    { name: 'Mark Attendance', icon: Clock, section: 'markAttendance' },
    { name: 'View Attendance', icon: Calendar, section: 'viewAttendance' },
    { name: 'Apply Leave', icon: FileText, section: 'applyLeave' },
    { name: 'View Payroll', icon: DollarSign, section: 'viewPayroll' },
    { name: 'View Notices', icon: FileText, section: 'viewNotices' }, // New entry for Notices

  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 bg-indigo-600 text-white">
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6" />
          <span className="text-lg font-semibold">Employee Portal</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-6">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveSection(item.section)}
            className={`flex items-center w-full px-6 py-3 text-sm ${
              activeSection === item.section
                ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}