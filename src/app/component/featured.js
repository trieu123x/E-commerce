import ps5 from "./asserts/ps5.png";
import gucci from "./asserts/gucci.png";
import speaker from "./asserts/speaker.png";
import women from "./asserts/women.png";

export default function Featured() {
  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex flex-row space-x-4 h-12 items-center ">
          <div className="bg-amber-600 rounded-sm w-4 h-full"></div>
          <h2 className="text-xl text-orange-600 font-bold ">Featured </h2>
        </div>
        <h1 className="text-4xl font-bold">New Arrivals</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 ">
          {/* LEFT BIG CARD */}
          <div className="relative bg-black  flex items-center justify-center overflow-hidden group">
            <div className=" ">
              <img
                src={ps5.src}
                alt="PS5"
                className=" group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-2xl font-semibold mb-2">PlayStation 5</h2>
              <p className="text-sm mb-4 text-gray-200">
                Black and White version of the PS5 coming out on sale.
              </p>
              <button className="underline  underline-offset-4">Shop Now</button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid grid-rows-2 gap-6">
            {/* TOP RIGHT LARGE */}
            <div className="relative  overflow-hidden group">
                          <div className=" h-85 flex items-end justify-end bg-black">
                              <img
                src={women.src}
                alt="women"
                className="  group-hover:scale-105 transition-transform duration-500"
              />
                          

              </div>

              <div className="absolute inset-0 bg-black/40"></div>

              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-xl font-semibold mb-2">
                  Women’s Collections
                </h2>
                <p className="text-sm mb-3 text-gray-200">
                  Featured woman collections that give you another vibe.
                </p>
                <button className="underline underline-offset-4">
                  Shop Now
                </button>
              </div>
            </div>

            {/* BOTTOM 2 SMALL CARDS */}
            <div className="grid grid-cols-2 gap-6">
              {/* Speakers */}
              <div className="relative  overflow-hidden">
                              <div className="h-85 flex items-center justify-center bg-[radial-gradient(circle_at_center,white_1%,gray_1%,black_80%)]">
                                  <img
                src={speaker.src}
                alt="speaker"
                className=" object-cover group-hover:scale-105 transition-transform duration-500"
              />
                </div>
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-lg font-semibold mb-1">Speakers</h2>
                  <p className="text-sm text-gray-200 mb-2">
                    Amazon wireless speakers
                  </p>
                  <button className="underline underline-offset-4 text-sm">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Perfume */}
              <div className="relative  overflow-hidden">
                              <div className="h-85 flex items-center justify-center bg-[radial-gradient(circle_at_center,white_1%,gray_1%,black_80%)]">
                                  <img
                src={gucci.src}
                alt="gucci"
                className=" object-cover group-hover:scale-105 transition-transform duration-500"
              />
                </div>
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-lg font-semibold mb-1">Perfume</h2>
                  <p className="text-sm text-gray-200 mb-2">
                    GUCCI INTENSE OUD EDP
                  </p>
                  <button className="underline underline-offset-4 text-sm">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="py-20 ">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          {/* ITEM 1 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-14 h-14 hover:scale-140 transition-transform duration-300 bg-black rounded-full flex items-center justify-center">
                {/* Truck SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 7h13v10H3z" />
                  <path d="M16 10h3l2 3v4h-5z" />
                  <circle cx="7.5" cy="17.5" r="1.5" />
                  <circle cx="17.5" cy="17.5" r="1.5" />
                </svg>
              </div>
            </div>

            <h3 className="mt-6 text-lg font-semibold uppercase">
              Free and Fast Delivery
            </h3>
            <p className="mt-2 text-gray-500 text-sm">
              Free delivery for all orders over $140
            </p>
          </div>

          {/* ITEM 2 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-14 h-14 hover:scale-140 transition-transform duration-300 bg-black rounded-full flex items-center justify-center">
                {/* Headset SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 12a8 8 0 0116 0v4a2 2 0 01-2 2h-2v-6h4" />
                  <path d="M4 12v6H2a2 2 0 01-2-2v-4a8 8 0 0116 0" />
                </svg>
              </div>
            </div>

            <h3 className="mt-6 text-lg font-semibold uppercase">
              24/7 Customer Service
            </h3>
            <p className="mt-2 text-gray-500 text-sm">
              Friendly 24/7 customer support
            </p>
          </div>

          {/* ITEM 3 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-14 h-14 hover:scale-140 transition-transform duration-300 bg-black rounded-full flex items-center justify-center">
                {/* Shield Check SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3l8 4v5c0 5-3.5 9-8 9s-8-4-8-9V7l8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>

            <h3 className="mt-6 text-lg font-semibold uppercase">
              Money Back Guarantee
            </h3>
            <p className="mt-2 text-gray-500 text-sm">
              We return money within 30 days
            </p>
          </div>

        </div>
      </div>
    </section>
      </div>
    </>
  );
}
