import '../styles/globals.css';

export const metadata = {
  title: 'Home Page',
  description: 'Welcome to Road To Dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-[#DEDEDE]">
          <header className="bg-blue-500 shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="text-xl font-bold text-white">Logo</div>
              <nav className="flex space-x-4">
                <a href="/" className="text-white">Home</a>
                <a href="/signup" className="text-white">Sign Up</a>
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