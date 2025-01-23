export default function Header() {
    return (
      <header className="bg-white shadow-md py-4 px-8 sticky top-0 z-50">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 drop-shadow-sm">
              Safe Haven
            </span>
          </div>
          
          <ul className="flex space-x-8">
            <li><a href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Home</a></li>
            <li><a href="/about" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">About</a></li>
            <li><a href="/services" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Services</a></li>
            <li><a href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Contact</a></li>
          </ul>
        </nav>
      </header>
    )
  }