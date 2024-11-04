import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowRight, PieChart, DollarSign, TrendingUp, Shield } from "lucide-react"
import { Dashboard } from "@/components/Dashboard"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { AuthPage } from "@/components/auth/AuthPage"
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <DollarSign className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">ExpenseTracker</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <ThemeToggle />
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">About</Button>
          <Button onClick={() => navigate('/auth')}>Sign Up</Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Master Your Finances with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Track expenses, set budgets, and achieve your financial goals with our intuitive expense tracking solution.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="h-11 px-8" onClick={() => navigate('/auth')}>
                  Get Started 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-11 px-8">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Visual Analytics</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Understand your spending patterns with beautiful charts and graphs
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Budget Planning</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Set and track budgets to reach your financial goals faster
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Secure & Private</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Your financial data is encrypted and never shared
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 ExpenseTracker. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Button variant="link" className="text-xs">Terms of Service</Button>
          <Button variant="link" className="text-xs">Privacy</Button>
        </nav>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
