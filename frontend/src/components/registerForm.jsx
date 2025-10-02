import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        // Store JWT token in localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        setResult(data);
        setError(null);
        nav("/home");
      } else {
        setError(data.message || 'Registration failed');
        setResult(null);
      }
    } catch (err) {
      setError(String(err));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-0 shadow-lg bg-card p-8">
      <header className="space-y-2 text-center pb-8">
        <h2 className="text-2xl font-bold text-balance">Create an Account</h2>
        <p className="text-muted-foreground">
          Join us today and get started in minutes
        </p>
      </header>
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium mr-6">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-input border-border focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input border-border focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium mr-6">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-input border-border focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
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

        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              href="/login"
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
