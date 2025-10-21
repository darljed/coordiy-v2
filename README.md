# CoorDIY - Digital Invitation Platform

CoorDIY is a microSaaS tool for creating and managing digital invitations with RSVP tracking. Built with Next.js 15, it offers a modern, mobile-friendly solution for event coordination.

## 🚀 Features

### Authentication & User Management
- **User Registration** - Full name, email, and password signup
- **Google OAuth** - Sign in with Google integration with automatic account linking
- **Facebook OAuth** - Sign in with Facebook integration with automatic account linking
- **Email Verification** - Secure email verification with JWT tokens
- **Login System** - JWT-based authentication with secure cookies
- **Password Reset** - Forgot password with secure email reset links
- **User Dashboard** - Personalized dashboard with user profile



### UI/UX Features
- **Responsive Design** - Mobile-first approach with shadcn/ui components
- **Dark/Light Theme** - Theme switching with system preference detection
- **PWA Support** - Progressive Web App with install prompts
- **Modern Sidebar** - Collapsible sidebar navigation with breadcrumbs

### Technical Features
- **Database Integration** - PostgreSQL with Prisma ORM
- **Email Service** - SMTP email sending for verification
- **Health Monitoring** - API health checks for database, auth, and email
- **Type Safety** - Full TypeScript implementation
- **Security** - Password hashing, JWT tokens, CSRF protection

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma
- **Authentication**: JWT with secure cookies + Google OAuth
- **UI**: shadcn/ui + Tailwind CSS
- **Email**: Nodemailer SMTP
- **Validation**: Zod schemas
- **Forms**: React Hook Form
- **Icons**: Lucide React

## 🏗 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── health/        # Health check endpoint
│   ├── dashboard/         # Main app pages
│   ├── signup/           # User registration
│   ├── verify-email/     # Email verification
│   ├── forgot-password/  # Password reset request
│   └── reset-password/   # Password reset form
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── auth-layout.tsx  # Authentication layout
│   └── dashboard-layout.tsx # Main app layout
├── lib/                 # Utilities and configurations
│   ├── auth.ts         # Authentication utilities
│   ├── constants.ts    # App constants and config
│   ├── email.ts        # Email service
│   └── prisma.ts       # Database client
└── middleware.ts       # Domain routing middleware
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- SMTP email service

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd coordiy2
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create `.env` file:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/coordiy"

# Authentication
JWT_SECRET="your-jwt-secret"
EMAIL_VERIFICATION_SECRET="your-email-verification-secret"

# Email Service
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="CoorDIY <noreply@coordiy.com>"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"

# OAuth Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH="true"
NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH="true"

# App URL
NEXTAUTH_URL="http://localhost:3000"
```

4. **Database Setup**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run Development Server**
```bash
npm run dev
```

### Development URLs
- **App**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🌐 Domain Configuration

### Development
- **App**: `localhost:3000`

### Production
- **App**: `coordiy.com`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/facebook` - Facebook OAuth login
- `GET /api/auth/facebook/callback` - Facebook OAuth callback
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### System
- `GET /api/health` - Health check (database, auth, email)

## 🎨 Design System

- **Primary Color**: #F76C5E (Coral)
- **Secondary Color**: #6AB7B9 (Teal)
- **UI Library**: shadcn/ui with Tailwind CSS
- **Typography**: Geist font family
- **Icons**: Lucide React

## 🔒 Security Features

- Password hashing with bcrypt
- JWT tokens with secure HTTP-only cookies
- Email verification for new accounts
- Input validation with Zod schemas
- CSRF protection via SameSite cookies
- Environment variable protection

## 📱 PWA Features

- Service worker for offline functionality
- App manifest for installation
- Install prompts for mobile devices
- Responsive design for all screen sizes

## 🚀 Deployment

The app is designed for deployment on Vercel with PostgreSQL database (Neon, Supabase, etc.).

```bash
npm run build
npm start
```

## 📄 License

Proprietary software. All rights reserved by Darl Jed Matundan. See LICENSE file for details.