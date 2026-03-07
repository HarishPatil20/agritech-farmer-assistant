import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"
import { motion } from "motion/react"

export function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
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
          <CardHeader className="space-y-1 text-center pb-6">
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
            <CardTitle className="text-3xl font-bold tracking-tight text-emerald-950">Create Account</CardTitle>
            <CardDescription className="text-emerald-700/80 text-base">
              Join the AgriTech platform
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-emerald-900">First name</Label>
                  <Input id="firstName" placeholder="John" required className="border-emerald-100 focus-visible:ring-emerald-500 bg-emerald-50/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-emerald-900">Last name</Label>
                  <Input id="lastName" placeholder="Doe" required className="border-emerald-100 focus-visible:ring-emerald-500 bg-emerald-50/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-emerald-900">Location (District/State)</Label>
                <Input id="location" placeholder="e.g., Wayanad, Kerala" required className="border-emerald-100 focus-visible:ring-emerald-500 bg-emerald-50/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-emerald-900">Language</Label>
                  <select 
                    id="language" 
                    className="flex h-10 w-full rounded-md border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    required
                  >
                    <option value="english">English</option>
                    <option value="kannada">Kannada</option>
                    <option value="malayalam">Malayalam</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crop" className="text-emerald-900">Primary Crop</Label>
                  <select 
                    id="crop" 
                    className="flex h-10 w-full rounded-md border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    required
                  >
                    <option value="paddy">Paddy</option>
                    <option value="corn">Corn</option>
                    <option value="arecanut">Areca nut</option>
                    <option value="tomato">Tomato</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-900">Password</Label>
                <Input id="password" type="password" required className="border-emerald-100 focus-visible:ring-emerald-500 bg-emerald-50/50" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button type="submit" className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm text-emerald-700/80">
                Already have an account?{" "}
                <Link to="/" className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

