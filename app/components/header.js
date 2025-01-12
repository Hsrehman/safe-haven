export default function Header() {
    return (
      <header className="bg-white shadow-md py-4 px-8">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-blue-600">
            Safe Haven
          </div>
          
          <ul className="flex space-x-8">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><a href="/about" className="hover:text-blue-600">About</a></li>
            <li><a href="/services" className="hover:text-blue-600">Services</a></li>
            <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </nav>
      </header>
    )
  }