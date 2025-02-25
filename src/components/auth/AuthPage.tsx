import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign } from "lucide-react"
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function AuthPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onLogin(values: z.infer<typeof loginSchema>) {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        username: values.username,
        password: values.password,
      });
      
      const { token, username } = response.data;
      setAuth(token, username);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
      // Optionally, handle error display to the user
    }
  }

  async function onSignup(values: z.infer<typeof signupSchema>) {
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        username: values.username,
        password: values.password,
        email: values.email,
      });
      console.log(response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
      // Optionally, handle error display to the user
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="mb-8 flex items-center space-x-2">
        <DollarSign className="h-6 w-6" />
        <span className="text-2xl font-bold">ExpenseTracker</span>
      </div>
      
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                        <FormLabel className="text-foreground/70">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username" 
                            className="border-input/30 bg-background/50"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                        <FormLabel className="text-foreground/70">Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your password" 
                            type="password" 
                            className="border-input/30 bg-background/50"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                        <FormLabel className="text-foreground/70">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username"
                            className="border-input/30 bg-background/50"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                        <FormLabel className="text-foreground/70">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="name@example.com"
                            type="email"
                            className="border-input/30 bg-background/50"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                        <FormLabel className="text-foreground/70">Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Create a password"
                            type="password"
                            className="border-input/30 bg-background/50"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                        <FormLabel className="text-foreground/70">Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Confirm your password"
                            type="password"
                            className="border-input/30 bg-background/50"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">
                    Create Account
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 