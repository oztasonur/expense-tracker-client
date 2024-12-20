import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, CreditCard, Wallet, LineChart } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"

interface Expense {
  id: number;
  userId: number;
  expenseName: string;
  description: string;
  amount: number;
  currency: string;
  expense: boolean;
}

export function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get('/expense/all');
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Calculate totals
  const totalBalance = expenses.reduce((acc, curr) => {
    return curr.expense ? acc - curr.amount : acc + curr.amount;
  }, 0);

  const monthlySpending = expenses
    .filter(exp => exp.expense)
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Updated just now
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlySpending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              This month's expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$892.00</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment Returns</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$421.50</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              All your transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`space-y-8 ${expenses.length > 15 ? 'h-[400px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-muted-foreground/10' : ''}`}>
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading...</div>
              ) : (
                [...expenses]
                  .reverse()
                  .map((expense) => (
                    <div key={expense.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{expense.expense ? '-' : '+'}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{expense.expenseName}</p>
                        <p className="text-sm text-muted-foreground">
                          {expense.description}
                        </p>
                      </div>
                      <div className={`ml-auto font-medium ${expense.expense ? 'text-red-500' : 'text-green-500'}`}>
                        {expense.expense ? '-' : '+'}${expense.amount.toFixed(2)}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 