import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { JWTPayload } from "@/lib/auth"

interface DashboardContentProps {
  user: JWTPayload
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Welcome card */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Welcome back!</span>
            </CardTitle>
            <CardDescription>
              You are successfully logged in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Name:</strong> {user.fullName}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature cards */}
        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>
              Create and manage your digital invitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" style={{ borderColor: '#F76C5E', color: '#F76C5E' }}>
              Create Event
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guests</CardTitle>
            <CardDescription>
              Track RSVPs and manage guest lists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" style={{ borderColor: '#6AB7B9', color: '#6AB7B9' }}>
              View Guests
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure your account preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Open Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}