"use client";

import './globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full antialiased bg-suivlima-bg">
      <body className="min-h-full flex flex-col font-sans text-gray-900">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981', // green-500
              },
            },
            error: {
              style: {
                background: '#EF4444', // red-500
              },
            },
          }}
        />
      </body>
    </html>
  );
}
