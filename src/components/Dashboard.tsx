import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, CreditCard, Wallet, LineChart, PlusIcon, MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Expense {
  id: number;
  userId: number;
  expenseName: string;
  description: string;
  amount: number;
  currency: string;
  expense: boolean;
}

const transactionSchema = z.object({
  expenseName: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  type: z.enum(["expense", "income"]),
})

export function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      expenseName: "",
      description: "",
      amount: "",
      type: "expense",
    },
  })

  const editForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      expenseName: "",
      description: "",
      amount: "",
      type: "expense",
    },
  });

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

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    try {
      await api.post('/expense/create', {
        expenseName: values.expenseName,
        description: values.description,
        amount: Number(values.amount),
        expense: values.type === "expense",
        currency: "USD" 
      });
      
      // Refresh expenses
      const response = await api.get('/expense/all');
      setExpenses(response.data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  }

  const handleEditTransaction = (expense: Expense) => {
    editForm.reset({
      expenseName: expense.expenseName,
      description: expense.description,
      amount: expense.amount.toString(),
      type: expense.expense ? "expense" : "income",
    });
    setEditingExpense(expense);
    setEditDialogOpen(true);
  };

  const onEditSubmit = async (values: z.infer<typeof transactionSchema>) => {
    if (!editingExpense) return;

    try {
      await api.put(`/expense/update/${editingExpense.id}`, {
        expenseName: values.expenseName,
        description: values.description,
        amount: Number(values.amount),
        currency: "USD",
        isExpense: values.type === "expense"
      });
      
      // Refresh expenses
      const response = await api.get('/expense/all');
      setExpenses(response.data);
      setEditDialogOpen(false);
      editForm.reset();
      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = (expense: Expense) => {
    setDeletingExpense(expense);
    setDeleteDialogOpen(true);
  };

  const onDeleteConfirm = async () => {
    if (!deletingExpense) return;

    try {
      await api.delete(`/expense/delete/${deletingExpense.id}`);
      
      // Refresh expenses
      const response = await api.get('/expense/all');
      setExpenses(response.data);
      setDeleteDialogOpen(false);
      setDeletingExpense(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Add a new expense or income to your tracker.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <div className="flex space-x-4">
                            <Button
                              type="button"
                              variant={field.value === "expense" ? "default" : "outline"}
                              onClick={() => field.onChange("expense")}
                            >
                              Expense
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "income" ? "default" : "outline"}
                              onClick={() => field.onChange("income")}
                            >
                              Income
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expenseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Transaction</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
                        <AvatarFallback className={`${expense.expense ? 'bg-red-500/20 text-white' : 'bg-green-500/20 text-white'}`}>
                          {expense.expense ? '-' : '+'}
                        </AvatarFallback>
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
                      <DropdownMenu open={dropdownOpen === expense.id} onOpenChange={(open) => setDropdownOpen(open ? expense.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              handleEditTransaction(expense);
                              setDropdownOpen(null);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 dark:text-red-400"
                            onClick={() => {
                              handleDeleteTransaction(expense);
                              setDropdownOpen(null);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Modify the transaction details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant={field.value === "expense" ? "default" : "outline"}
                          onClick={() => field.onChange("expense")}
                        >
                          Expense
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "income" ? "default" : "outline"}
                          onClick={() => field.onChange("income")}
                        >
                          Income
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="expenseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter amount" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 