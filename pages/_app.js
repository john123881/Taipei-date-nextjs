import Footer from '@/components/ui/footer/footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from '@/components/ui/navbar/navbar';
import '@/styles/globals.css';
import { useState } from 'react';
import { AuthContextProvider } from '@/context/auth-context';
import { NotifyProvider } from '@/context/use-notify';
import { Toaster } from 'react-hot-toast';
import { DateProvider } from '@/context/date-context';
import { LoaderProvider } from '@/context/use-loader';
import { PostProvider } from '@/context/post-context';
import { CollectProvider } from '@/context/use-collect';

import LoginModal from '@/components/ui/login-modal/login-modal';
export default function App({ Component, pageProps }) {
  const [currentPageTitle, setCurrentPageTitle] = useState('');
  const handlePageChange = (pageTitle) => {
    setCurrentPageTitle(pageTitle);
  };
  return (
    <>
      <AuthContextProvider>
        <LoaderProvider>
          <NotifyProvider>
            <CollectProvider>
              <DateProvider>
                <PostProvider>
                  <Toaster />
                  <Navbar currentPageTitle={currentPageTitle} />
                  <LoginModal />
                  <Component {...pageProps} onPageChange={handlePageChange} />
                  <SpeedInsights />
                  <Footer />
                </PostProvider>
              </DateProvider>
            </CollectProvider>
          </NotifyProvider>
        </LoaderProvider>
      </AuthContextProvider>
    </>
  );
}
