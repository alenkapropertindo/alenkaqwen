'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border-purple-500 border-2 shadow-[0_0_15px_#8b5cf6] shadow-purple-500/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign up for a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Enter your full name"
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-gray-300">WhatsApp Number</Label>
              <Input 
                id="whatsapp" 
                type="tel" 
                placeholder="Enter your WhatsApp number"
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Create a password"
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300">
            Sign Up
          </Button>
          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a href="/auth/login" className="text-purple-400 hover:text-purple-300 hover:underline">
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}