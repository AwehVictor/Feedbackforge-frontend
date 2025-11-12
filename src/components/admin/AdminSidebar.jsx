import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MessageSquare, X, LogOut, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AdminSidebar = ({ activeTab, setActiveTab, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const menuItems = [
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
    },
    {
      id: 'performance',
      label: 'Performance Trends',
      icon: TrendingUp,
    },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      {/* Sidebar Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">FeedbackForge</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="hover:bg-sidebar-accent"
          >
            <X className="w-4 h-4 text-sidebar-foreground" />
          </Button>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full justify-start px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-sidebar-active text-sidebar-active-foreground'
                          : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start border-sidebar-border hover:bg-destructive hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

