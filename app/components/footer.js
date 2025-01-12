export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Safe Haven</h3>
            <p className="text-gray-300">Your home comfort awaits</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/services" className="hover:text-white">Services</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@safehaven.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Safe Street</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-700">
          <p className="text-center text-gray-300">
            © 2024 Safe Haven. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }