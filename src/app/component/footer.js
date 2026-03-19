import Qr from "./asserts/Qrcode 1.png";
import ggplay from "./asserts/ggplay.png";
import appstore from "./asserts/appstore.png";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 pt-16 pb-6  w-full">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Column 1 */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">
              Exclusive
            </h2>

            <h3 className="text-white font-medium mb-3">
              Subscribe
            </h3>

            <p className="text-sm mb-4">
              Get 10% off your first order
            </p>

            <div className="flex border border-gray-600 rounded px-3 py-2 
                            focus-within:border-white 
                            focus-within:shadow-[0_0_8px_rgba(255,255,255,0.3)]
                            transition">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent outline-none text-sm flex-1 placeholder-gray-500"
              />
              <button className="text-white hover:scale-110 transition">
                ➤
              </button>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</li>
              <li className="hover:text-white transition cursor-pointer">
                exclusive@gmail.com
              </li>
              <li className="hover:text-white transition cursor-pointer">
                +88015-88888-9999
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-medium mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              {["My Account", "Login / Register", "Cart", "Wishlist", "Shop"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-white transition cursor-pointer"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-white font-medium mb-4">Quick Link</h3>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms Of Use", "FAQ", "Contact"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-white transition cursor-pointer"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="text-white font-medium mb-4">
              Download App
            </h3>

            <p className="text-sm mb-3">
              Save $3 with App New User Only
            </p>

            <div className="flex gap-3 mb-4">
                          <div className=" bg-gray-700 rounded">
                <img src={Qr.src} className="w-full h-full " />
              </div>

              <div className="flex flex-col gap-2">
                              <div className="  ">
                <img src={ggplay.src} className="w-full h-full " />
                </div>
                              <div className=" ">
                <img src={appstore.src} className="w-full h-full " />
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-5">

              {/* Facebook */}
              <a href="#" className="group">
                <svg
                  className="w-5 h-5 fill-gray-400 group-hover:fill-white transition transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7H7.9v-2.9h2.6V9.6c0-2.6 1.6-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6v1.9h2.9l-.5 2.9h-2.4v7A10 10 0 0022 12z" />
                </svg>
              </a>

              {/* Twitter */}
              <a href="#" className="group">
                <svg
                  className="w-5 h-5 fill-gray-400 group-hover:fill-white transition transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 5.9c-.8.4-1.7.6-2.6.8a4.6 4.6 0 002-2.5c-.9.6-1.9 1-3 1.2A4.6 4.6 0 0016 4a4.6 4.6 0 00-4.6 4.6c0 .4 0 .8.1 1.2A13 13 0 013 5s-4 9 5 13a13.4 13.4 0 01-8 2c9 5.5 20 0 20-11.4v-.5c.8-.5 1.5-1.3 2-2.2z" />
                </svg>
              </a>

              {/* Instagram */}
              <a href="#" className="group">
                <svg
                  className="w-5 h-5 fill-gray-400 group-hover:fill-white transition transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5.8A4.2 4.2 0 1111.8 16 4.2 4.2 0 0112 7.8zm4.5-.9a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="#" className="group">
                <svg
                  className="w-5 h-5 fill-gray-400 group-hover:fill-white transition transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5A2.5 2.5 0 102 6a2.5 2.5 0 002.98-2.5zM2 8h6v14H2zM9 8h5.5v2h.1c.8-1.5 2.7-2.5 4.4-2.5 4.7 0 5.6 3.1 5.6 7.1V22h-6v-6.8c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V22H9z" />
                </svg>
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          © Copyright Rimel 2022. All right reserved
        </div>

      </div>
    </footer>
  );
}