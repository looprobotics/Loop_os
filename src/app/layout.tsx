
'use client';

import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LayoutDashboard, Truck, Orbit, Package, Waypoints, BarChart3, Info, LogIn } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import LogoImage from '@/image/logo.png';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarRail
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TasksProvider } from '@/context/TasksContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { ManualLoadingProvider, useManualLoading } from '@/context/ManualLoadingContext';
import { GlobalLoadingIndicator } from '@/components/ui/GlobalLoadingIndicator';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400', '700']
});

// SidebarLinks Component
function SidebarLinks() {
  const { triggerLoading } = useManualLoading();
  const handleLinkClick = () => {
    triggerLoading();
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Dashboard" asChild>
          <Link href="/" onClick={handleLinkClick} className="group hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150">
            <LayoutDashboard />
            <span className="group-data-[collapsible=icon]:hidden group-hover:text-base transition-all duration-150">Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Fleet Management" asChild>
          <Link href="/fleet-management" onClick={handleLinkClick} className="group hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150">
            <Truck />
            <span className="group-data-[collapsible=icon]:hidden group-hover:text-base transition-all duration-150">Fleet Management</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
         <SidebarMenuButton tooltip="Remote Operation" asChild>
          <Link href="/remote-operation" onClick={handleLinkClick} className="group hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150">
            <Orbit />
            <span className="group-data-[collapsible=icon]:hidden group-hover:text-base transition-all duration-150">Remote Operation</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
         <SidebarMenuButton tooltip="Pallet Management" asChild>
          <Link href="/pallet-management" onClick={handleLinkClick} className="group hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150">
            <Package />
            <span className="group-data-[collapsible=icon]:hidden group-hover:text-base transition-all duration-150">Pallet Management</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
         <SidebarMenuButton tooltip="Mapping" asChild>
          <Link href="/mapping" onClick={handleLinkClick} className="group hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150">
            <Waypoints />
            <span className="group-data-[collapsible=icon]:hidden group-hover:text-base transition-all duration-150">Mapping</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
         <SidebarMenuButton tooltip="Reporting" asChild>
          <Link href="/reporting" onClick={handleLinkClick} className="group hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150">
            <BarChart3 />
            <span className="group-data-[collapsible=icon]:hidden group-hover:text-base transition-all duration-150">Reporting</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="About Us" asChild>
          <Link href="/about-us" onClick={handleLinkClick} className="group hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150">
            <Info />
            <span className="group-data-[collapsible=icon]:hidden group-hover:text-base transition-all duration-150">About Us</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}

// SidebarFooterContent Component
function SidebarFooterContent() {
  const { triggerLoading } = useManualLoading();
  const handleLinkClick = () => {
    triggerLoading();
  };

  return (
     <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/profile"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-1.5 group transition-colors duration-150"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden group-hover:text-base transition-all duration-150">John Krasinski</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" align="center" className="hidden group-data-[state=collapsed]:block">
        <p>John Krasinski</p>
        <p className="text-xs text-muted-foreground">View Profile</p>
      </TooltipContent>
    </Tooltip>
  );
}

// MainLayoutContent - this component now contains the sidebar and main app structure
function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { triggerLoading } = useManualLoading(); // For logo clicks

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" collapsible="icon" className="bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="p-2.5 flex justify-center items-center h-[60px] mb-2">
          <Link href="/" onClick={triggerLoading} className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <Image
              src={LogoImage}
              alt="FleetView Logo"
              data-ai-hint="company logo"
              width={120}
              height={30}
              className="group-data-[collapsible=icon]:hidden"
              priority
            />
            <Image
              src={LogoImage}
              alt="FleetView Logo Icon"
              data-ai-hint="company logo"
              width={32}
              height={32}
              className="hidden group-data-[collapsible=icon]:block"
              priority
            />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarLinks />
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
          <SidebarFooterContent />
        </SidebarFooter>
      </Sidebar>

      <SidebarRail className="hidden md:flex" />

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-background px-4 sm:px-6">
          <div className="flex items-center gap-4 md:hidden">
            <SidebarTrigger />
            <Link href="/" onClick={triggerLoading} className="flex items-center gap-2 font-semibold">
              <Image
                src={LogoImage}
                alt="FleetView Logo Mobile"
                data-ai-hint="company logo"
                width={100}
                height={24}
                priority
              />
            </Link>
          </div>
          <div className="hidden md:flex flex-1"></div>
          <ThemeToggleButton />
        </header>
        <div className="flex-grow p-4 md:p-6 bg-transparent">
          {children}
        </div>
        <footer className="py-4 text-center text-xs text-muted-foreground border-t border-sidebar-border">
          © 2025 Loop Robotiks Technologies
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

// AppContent: Handles routing logic based on authentication state
function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoadingAuth, pathname, router]);

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 z-[100] flex h-screen w-screen flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3 rounded-lg bg-card p-6 shadow-2xl">
          <LogIn className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>; // Render login page content directly without main layout
  }

  if (!isAuthenticated) {
    // This case should ideally be caught by the useEffect redirect.
    // Return null or a loading indicator while redirecting.
    return null; 
  }

  // If authenticated and not on login page, render the main application layout
  return <MainLayoutContent>{children}</MainLayoutContent>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>FleetView Dashboard</title>
        <meta name="description" content="Autonomous Mobile Robot Fleet Management" />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <TasksProvider>
              <ManualLoadingProvider>
                <GlobalLoadingIndicator /> {/* For manual link clicks */}
                <AppContent>{children}</AppContent>
              </ManualLoadingProvider>
            </TasksProvider>
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
