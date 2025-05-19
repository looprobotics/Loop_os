
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Or next/router for older Next.js versions

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    console.log('User logged out');
    // In a real app, you would handle actual logout logic here
    // and then redirect, e.g., to the login page or homepage.
    // For now, let's just redirect to the homepage as an example.
    router.push('/'); 
  };

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
            <UserCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>Manage your account settings and logout.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-lg font-semibold">John Krasinski</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">john.krasinski@example.com</p>
          </div>
          {/* Add more profile information here as needed */}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
