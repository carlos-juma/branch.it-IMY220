import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const nav = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      
      if (res.ok && data.token) {
        // Store JWT token in localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        setResult(data)
        setError(null)
        nav("/home")
      } else {
        setError(data.message || 'Login failed')
        setResult(null)
      }
    } catch (err) {
      setError(String(err))
      setResult(null)
    } finally {
      setIsLoading(false)
    }
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

        {result && (
          <pre className="mt-4 p-3 bg-white/70 rounded text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
        {error && (
          <div className="mt-2 text-red-600 text-sm">{error}</div>
        )}

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
