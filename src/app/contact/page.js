"use client";
import { Phone, Mail } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function ContactPage() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.phone || !form.message) {
            setError("Please fill in all required fields.");
            setTimeout(() => {
                setError("");
            }, 3000);
            return;
        }
        setError("");
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            
        }, 3000)
    };
  return (
      <div className="bg-gray-50 min-h-screen py-12 px-6">
          {success && (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 
                 bg-green-500 text-white px-6 py-3 
                 rounded-md shadow-lg z-50"
    >
      Your message has been sent successfully! We will get back to you soon.
    </motion.div>
          )}
          {error && (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 
                 bg-red-500 text-white px-6 py-3 
                 rounded-md shadow-lg z-50"
    >
        {error}
    </motion.div>
  )}
      {/* Container */}
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-8">
          Home <span className="mx-2">/</span>{" "}
          <span className="text-black font-medium">Contact</span>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* LEFT SIDE */}
          <div className="bg-white p-8 rounded-lg shadow-sm col-span-1 space-y-8">
            
            {/* Call To Us */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full">
                  <Phone size={18} />
                </div>
                <h3 className="font-semibold text-lg">Call To Us</h3>
              </div>

              <p className="text-gray-500 text-sm mb-3">
                We are available 24/7, 7 days a week.
              </p>
              <p className="text-sm text-gray-700">
                Phone: +8801611112222
              </p>
            </div>

            <hr />

            {/* Write To Us */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full">
                  <Mail size={18} />
                </div>
                <h3 className="font-semibold text-lg">Write To Us</h3>
              </div>

              <p className="text-gray-500 text-sm mb-3">
                Fill out our form and we will contact you within 24 hours.
              </p>
              <p className="text-sm text-gray-700">
                Emails: customer@exclusive.com
              </p>
              <p className="text-sm text-gray-700">
                Emails: support@exclusive.com
              </p>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="bg-white p-8 rounded-lg shadow-sm md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Top inputs */}
              <div className="grid md:grid-cols-3 gap-4">
                <input
                                  type="text"
                                  value={form.name}
                                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Your Name *"
                  className="bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-red-400"
                />
                <input
                                  type="email"
                                  value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="Your Email *"
                  className="bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-red-400"
                />
                <input
                                  type="text"
                                  value={form.phone}
                                    onChange={(e) => setForm({...form, phone: e.target.value})}
                  placeholder="Your Phone *"
                  className="bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Message */}
              <textarea
                              rows="6"
                              value={form.message}
                                onChange={(e) => setForm({...form, message: e.target.value})}
                placeholder="Your Message"
                className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-red-400"
              ></textarea>

              {/* Button */}
              <div className="flex justify-end">
                <button
                    type="submit"
                  className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Send Message
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}