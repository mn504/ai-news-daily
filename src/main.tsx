import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Toaster } from "sonner";
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              border: "1px solid #334155",
              color: "#f8fafc",
            },
          }}
        />
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)
