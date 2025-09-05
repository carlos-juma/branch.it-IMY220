import React from "react"
import { useState } from "react"


export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Login attempt:", { email, password })
    setIsLoading(false)
  }

  return (
    <div className="border-0 shadow-lg bg-card p-8">
      <div className="space-y-2 text-center pb-8">
        <h2 className="text-2xl font-bold text-balance">Welcome Back</h2>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <label htmlFor="email" className="text-sm font-medium mr-6">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input border-border focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium mr-6">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input border-border focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center space-y-4">
          <label className="text-sm text-accent hover:text-accent/80 transition-colors">
            Forgot your password?
          </label>
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <label href="/register" className="text-accent hover:text-accent/80 font-medium transition-colors">
              Create one
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
