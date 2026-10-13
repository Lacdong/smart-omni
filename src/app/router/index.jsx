import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { LandingPage } from '@/features/landing/LandingPage'
import { AuthPlaceholder } from '@/features/auth/pages/AuthPlaceholder'
import { NotFoundPage } from '@/app/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/auth/login', element: <AuthPlaceholder mode="login" /> },
      { path: '/auth/register', element: <AuthPlaceholder mode="register" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
