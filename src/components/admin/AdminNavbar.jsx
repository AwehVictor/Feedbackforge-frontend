import { Button } from '@/components/ui/button';
import { MessageSquare, TrendingUp } from 'lucide-react';

export const AdminNavbar = ({ activeTab, sidebarOpen, setSidebarOpen }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'feedback':
        return {
          title: 'Feedback Management',
          description: 'Track and manage customer feedback',
          icon: MessageSquare,
        };
      case 'performance':
        return {
          title: 'Performance Trends',
          description: 'Analyze feedback trends and insights',
          icon: TrendingUp,
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Admin Portal',
          icon: MessageSquare,
        };
    }
  };

  const { title, description, icon: Icon } = getTitle();

  return (
    <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-sidebar-accent"
          >
            <Icon className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
     
    </header>
  );
};

