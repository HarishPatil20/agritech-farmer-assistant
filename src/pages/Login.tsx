import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"
import { motion } from "motion/react"

export function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      navigate("/dashboard")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('https://picsum.photos/seed/agriculture/1920/1080')] bg-cover bg-center p-4 relative">
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-white/20">
          <CardHeader className="space-y-1 text-center pb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 shadow-lg shadow-emerald-500/30">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tight text-emerald-950">AgriTech</CardTitle>
            <CardDescription className="text-emerald-700/80 text-base">
              Sign in to your farmer dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-900">Email or Phone</Label>
                <Input id="email" type="text" placeholder="farmer@example.com" required className="h-12 border-emerald-100 focus-visible:ring-emerald-500 bg-emerald-50/50" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-emerald-900">Password</Label>
                  <Link to="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required className="h-12 border-emerald-100 focus-visible:ring-emerald-500 bg-emerald-50/50" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-4">
              <Button type="submit" className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-center text-sm text-emerald-700/80">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">
                  Register here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
