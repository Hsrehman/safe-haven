import './styles/globals.css'
import Header from './components/header'
import Footer from './components/footer'

export const metadata = {
  title: 'Safe Haven',
  description: 'Your home comfort awaits'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}