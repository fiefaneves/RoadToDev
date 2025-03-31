"use client";

import '../styles/globals.css';
import Image from 'next/image';
import { RoadMapProvider } from './RoadMapContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
      setLoading(false);
    }
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/RoadToDev_icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/RoadToDev_icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <RoadMapProvider>
          <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg w-full">
              <div className="w-full px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Image
                    width={30}
                    height={30}
                    src="/RoadToDev_icon.svg"
                    alt="RoadToDev Icon"
                  />
                  <h1 className="text-white text-xl font-semibold drop-shadow-md">Road To Dev</h1>
                </div>
                <nav className="flex space-x-6">
                  <Link href="/" className="text-white font-medium hover:text-purple-300 transition-colors duration-200 hover:underline"
                  >
                  Login
                  </Link>
                  <Link href="/create_account" className="text-white font-medium hover:text-purple-300 transition-colors duration-200 hover:underline"
                  >
                  Criar conta
                  </Link>
                  {!loading && userId ? (
                    <Link
                      href={`/intermediateScreen/${userId}`}
                      className="hover:opacity-80 transition-opacity flex items-center flex-shrink-0"
                    >
                      <Image
                        width={24}
                        height={24}
                        src="/userIcon.svg"
                        alt="User Icon"
                        className="drop-shadow-md"
                      />
                    </Link>
                  ) : (
                    (
                      <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                    )
                  )}
                </nav>
              </div>
            </header>
            <main className="flex-grow ">{children}</main>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            <footer className="bg-gradient-to-r from-purple-50 to-blue-50 py-4 mt-auto">
              <div className="max-w-7xl mx-auto px-6">
                <p className="text-gray-600 text-sm text-center">
                  © {new Date().getFullYear()} Road To Dev. Todos os direitos reservados.
                </p>
              </div>
            </footer>
          </div>
        </RoadMapProvider>
      </body>
    </html>
  );
}