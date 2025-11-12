import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { FeedbackTab } from '../components/admin/FeedbackTab';
import { PerformanceTrendsTab } from '../components/admin/PerformanceTrendsTab';

export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('feedback');

  const renderContent = () => {
    switch (activeTab) {
      case 'feedback':
        return <FeedbackTab />;
      case 'performance':
        return <PerformanceTrendsTab />;
      default:
        return <FeedbackTab />;
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen w-full bg-admin-dashboard-background">
        {/* Sidebar */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <AdminNavbar 
            activeTab={activeTab} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />

          {/* Main Content - Dynamic based on active tab */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
