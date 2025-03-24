"use client";

import '../styles/globals.css';
import Image from 'next/image';
import { RoadMapProvider } from './RoadMapContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'));
    }
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
      </head>
      <body>
        <RoadMapProvider>
          <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-blue-500 shadow-md w-[100%]">	
              <div className="w-full px-4 py-4 flex justify-between items-center">
                <div>
                  <Image
                    width={30}
                    height={30}
                    src="/RoadToDev_icon.svg"
                    alt="RoadToDev Icon"
                  />
                </div>
                <nav className="flex space-x-4 ml-auto">
                  <Link href="/" className="text-white">Login</Link>
                  <Link href="/create_account" className="text-white">Create account</Link>
                  {userId && (
                    <Link href={`/intermediateScreen/${userId}`}>
                      <Image
                        width={20}
                        height={20}
                        src="/userIcon.svg"
                        alt="User Icon"
                      />
                    </Link>
                  )}
                </nav>
              </div>
            </header>
            <main className="flex-grow">{children}</main>
            <div className="bg-neutral-500 h-[1px]"></div>
            <footer className="text-neutral-700 text-center py-2 mt-auto">
              <p>All rights reserved by...</p>
            </footer>
          </div>
        </RoadMapProvider>
      </body>
    </html>
  );
}