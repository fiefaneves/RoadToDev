import '../styles/globals.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const metadata = {
  title: 'RoadToDev',
  description: 'Welcome to Road To Dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-[#DEDEDE]">
          <header className="bg-blue-500 shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="text-xl font-bold text-white">Logo</div>
              <nav className="flex space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className='text-white'
                > Home </button>
                <button
                  onClick={() => router.push('/signUp')}
                  className='text-white'
                > Sign Up </button>
                <Image 
                width={20}
                height={20}
                src="/userIcon.svg"
                alt="User Icon"
                ></Image>
              </nav>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <div className='bg-neutral-500 h-[1px]'></div>
          <footer className="text-neutral-700 text-center py-2 mt-auto">
            <p>All rights reserved by...</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
