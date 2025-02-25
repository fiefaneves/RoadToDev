import '../styles/globals.css';
import Image from 'next/image';
import { RoadMapProvider } from './RoadMapContext';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'RoadToDev',
  description: 'Welcome to Road To Dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RoadMapProvider>
          <div className="min-h-screen flex flex-col bg-[#DEDEDE]">
            <header className="bg-blue-500 shadow-md w-[100%]">	
              <div className="w-[full] px-4 py-4 flex justify-between items-center">
                <div>
                <Image
                  width={30}
                  height={30}
                  src="/RoadToDev_icon.svg"
                  alt="RoadToDev Icon"
                ></Image>
                  </div>
                <nav className="flex space-x-4 ml-auto">
                  <Link href="/login" className="text-white">Login</Link>
                  <Link href="/" className="text-white">Home</Link>
                  <Link href="/signUp" className="text-white">Sign Up</Link>
                  <Image
                    width={20}
                    height={20}
                    src="/userIcon.svg"
                    alt="User Icon"
                  />
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
