import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <a className="flex items-center justify-center" href="/">
            <DollarSign className="h-6 w-6" />
            <span className="ml-2 text-lg font-semibold">ExpenseTracker</span>
          </a>
          <nav className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              Settings
            </Button>
            <Button variant="ghost" size="sm">
              Help
            </Button>
            <Button size="sm">
              Logout
            </Button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
} 