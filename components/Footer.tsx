import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-white mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-lg font-bold mb-4">About EMA</h3>
            <p className="text-gray-300 text-sm">
              Professional network advancing environmental excellence and due diligence in BC.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-gray-300 hover:text-white">
                  Member Directory
                </Link>
              </li>
              <li>
                <Link href="/board" className="text-gray-300 hover:text-white">
                  Board
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Membership</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/join" className="text-gray-300 hover:text-white">
                  Join EMA
                </Link>
              </li>
              <li>
                <Link href="/renew" className="text-gray-300 hover:text-white">
                  Renew Membership
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-gray-300 hover:text-white">
                  Member Benefits
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:info@emaofbc.com" className="hover:text-white">
                  info@emaofbc.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-white">
                  (123) 456-7890
                </a>
              </li>
              <li>Vancouver, BC</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} Environmental Managers Association of BC. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
