import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { DollarSign, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from '@/contexts/AuthContext';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { setAuth, username } = useAuth();

  const handleLogout = () => {
    setAuth(null, null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <a className="flex items-center justify-center" href="/">
            <DollarSign className="h-6 w-6" />
            <span className="ml-2 text-lg font-semibold">ExpenseTracker</span>
          </a>
          <nav className="ml-auto flex items-center space-x-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{username}</span>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="sm">Settings</Button>
            <Button variant="ghost" size="sm">Help</Button>
            <Button size="sm" onClick={handleLogout}>Logout</Button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
} 