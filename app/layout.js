import './styles/globals.css';
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

      </body>
    </html>
  );
}