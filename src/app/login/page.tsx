
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import LogoImage from '@/image/logo.png';

export default function LoginPage() {
  const { login, isAuthenticated, isLoadingAuth } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
    setIsSubmitting(false);
    // On success, login function in AuthContext handles redirection
  };
  
  if (isLoadingAuth) {
    // You can show a more specific loading indicator or keep it minimal
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LogIn className="h-10 w-10 text-primary animate-pulse" />
      </div>
    );
  }
  
  // If already authenticated (and not loading), redirect is handled by useEffect
  // This prevents rendering the form if redirection is pending
  if (isAuthenticated) {
      return (
      <div className="fixed inset-0 z-[100] flex h-screen w-screen flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3 rounded-lg bg-card p-6 shadow-2xl">
          <LogIn className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-sm shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-2 pt-8">
          <div className="mx-auto mb-2">
            <Image 
              src={LogoImage} 
              alt="Loop OS Logo" 
              width={150} 
              height={40} 
              priority 
              data-ai-hint="company logo"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Loop OS
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Revolutionizing Warehouse Automation
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 pt-4 pb-8">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="text-base border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="text-base border-primary"
              />
            </div>
            {error && (
              <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/30">
                <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="px-6 pb-8">
            <Button type="submit" className="w-full py-3 text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <LogIn className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    
