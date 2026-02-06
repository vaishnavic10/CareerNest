import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout.js';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/context/authContext';
import { ThemeProvider } from '@/context/themeContext';
import { Toaster } from 'react-hot-toast';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export default function RootLayout({ children }) {
  return (
      <html lang="en" className="scroll-smooth antialiased">
        <head>
            <link rel="icon" href="/logos.png"  sizes="any" type="image/png" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Showcase your skills, write a blog, build a portfolio and resume." />
            <meta name="keywords" content="Eminent Hub, showcase skills, blog, portfolio, resume" />
            <meta name="author" content="Kirtesh Admute" />
            <meta name="robots" content="index, follow" />
            <title>Eminent Hub</title>
        </head>
      <body
          
          suppressHydrationWarning={true}
          className={`${geistSans.variable} ${geistMono.variable} antialiased no-scrollbar`}
      >
      <ThemeProvider>
        <AuthProvider>
          <div className="relative">
            <DashboardLayout>
              <div className="pt-20">{children}</div>
            </DashboardLayout>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  style: {
                    zIndex: 9999,
                  },
                }}
            />
          </div>
        </AuthProvider>
      </ThemeProvider>
      </body>
      </html>
  );
}