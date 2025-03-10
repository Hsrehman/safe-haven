import './styles/globals.css';
import Header from './components/header';
import Footer from './components/footer';
import Chatbot from './components/Chatbot';

export const metadata = {
  title: 'Safe Haven',
  description: 'Your home comfort awaits',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Chatbot />
        <Footer />
      </body>
    </html>
  );
}