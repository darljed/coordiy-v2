export const APP_CONFIG = {
  name: "CoorDIY",
  description: "Digital invitation creation & sharing platform",
  tagline: "Your coordination platform",
  supportEmail: "darl@darl.dev",
  baseUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  logo: "/coordiy_long_logo.png",
  logoMini: "/coordiy_logo.png",
  colors: {
    primary: "#F76C5E",
    secondary: "#6AB7B9"
  },
  auth: {
    enableGoogleAuth: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true",
    enableFacebookAuth: process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH === "true"
  }
} as const