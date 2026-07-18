import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { themeAtom } from '@/features/atoms'
import { Providers } from '@/app/providers'
import { router } from '@/app/router'
import '@/styles/globals.css'

function ThemeInit() {
  const theme = useAtomValue(themeAtom)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return null
}

function App() {
  return (
    <Providers>
      <ThemeInit />
      <RouterProvider router={router} />
    </Providers>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
