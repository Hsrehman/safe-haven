import './styles/globals.css
import Header from './components/header';
import Footer from './components/footer';
import Messaging from './components/Messaging';
import Chatbot from './components/Chatbot';

export const metadata = {
  title: 'Safe Haven',
  description: 'Your home comfort awaits',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body suppressHydrationWarning={true}>
        <Header />

        {children}

        <Footer />

        {/* Messaging Component - Fixed at Bottom Right */}
        <div className="fixed bottom-4 right-4 w-96 shadow-lg">
          <Messaging userId="currentUserId" />
        </div>
        <Chatbot />
      </body>
    </html>
  );
}