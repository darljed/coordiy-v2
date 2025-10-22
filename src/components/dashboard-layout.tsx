"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeSelector } from "@/components/theme-selector"
import { LogOut, Home, Calendar } from "lucide-react"
import { JWTPayload } from "@/lib/auth"
import { APP_CONFIG } from "@/lib/constants"
import Image from "next/image"

interface DashboardLayoutProps {
  user: JWTPayload
  children: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Events", href: "/dashboard/events" },
]

export function DashboardLayout({ user, children, breadcrumbs = [{ label: "Dashboard" }] }: DashboardLayoutProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getUserInitials = (fullName: string) => {
    return fullName.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="px-4 py-2 group-data-[collapsible=icon]:px-0">
            <Image 
              src={APP_CONFIG.logo} 
              alt={APP_CONFIG.name} 
              width={120}
              height={32}
              className="h-8 w-auto group-data-[collapsible=icon]:hidden"
            />
            <div className="group-data-[collapsible=icon]:flex hidden justify-center">
              <Image 
                src={APP_CONFIG.logoMini} 
                alt={APP_CONFIG.name} 
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton onClick={() => router.push(item.href)} tooltip={item.label}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 justify-start px-2 py-2 h-auto">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.fullName} />}
                  <AvatarFallback className="text-xs" style={{ backgroundColor: '#6AB7B9', color: 'white' }}>
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left ml-3 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium truncate">{user.fullName}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                <div className="p-2">
                  <ThemeSelector />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      
      <main className="flex-1 md:p-2 lg:p-6 bg-muted/50 rounded-tl-lg">
        <div className="bg-background rounded-lg border h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {crumb.href ? (
                          <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}