import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Product Enquiry',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    // Build WhatsApp message
    const message = `New enquiry from ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}
Subject: ${formData.subject}
Message: ${formData.message}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919952981365?text=${encodedMessage}`;

    // Show success and redirect
    alert("Message sent! We'll get back to you soon 🌿");
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Product Enquiry',
      message: ''
    });
  };

  return (
    <div className="bg-[#FDFAF5] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* SECTION 1 - HERO */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#8B1A1A] mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you. Reach out for orders, queries, or just to say hello!
            </p>
          </motion.div>
        </section>

        {/* SECTION 2 - CONTACT CARDS ROW */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1 - WhatsApp */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#25D366] text-white rounded-2xl p-6 text-center shadow-md flex flex-col h-full"
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Chat on WhatsApp</h3>
            <p className="mb-6 flex-grow font-medium">+91 99529 81365</p>
            <a 
              href="https://wa.me/919952981365"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#25D366] px-6 py-2 rounded-xl font-bold hover:bg-green-50 transition-colors inline-block w-full"
            >
              Start Chat
            </a>
          </motion.div>

          {/* Card 2 - Email */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#8B1A1A] text-white rounded-2xl p-6 text-center shadow-md flex flex-col h-full"
          >
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold mb-2">Send an Email</h3>
            <p className="mb-6 flex-grow font-medium">thaaragainaturals@gmail.com</p>
            <a 
              href="mailto:thaaragainaturals@gmail.com"
              className="bg-white text-[#8B1A1A] px-6 py-2 rounded-xl font-bold hover:bg-red-50 transition-colors inline-block w-full"
            >
              Send Email
            </a>
          </motion.div>

          {/* Card 3 - Instagram */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 text-center shadow-md flex flex-col h-full"
          >
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-2">Follow Us</h3>
            <p className="mb-6 flex-grow font-medium">@thaaragai.naturals</p>
            <a 
              href="https://instagram.com/thaaragai.naturals"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-pink-500 px-6 py-2 rounded-xl font-bold hover:bg-pink-50 transition-colors inline-block w-full"
            >
              Follow
            </a>
          </motion.div>
        </section>

        {/* SECTION 3 - ENQUIRY FORM */}
        <section className="max-w-2xl mx-auto mb-16">
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#2D6A2D] text-center mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A2D] focus:border-[#2D6A2D] outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A2D] focus:border-[#2D6A2D] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A2D] focus:border-[#2D6A2D] outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A2D] focus:border-[#2D6A2D] outline-none transition-all bg-white"
                  >
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Place an Order">Place an Order</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A2D] focus:border-[#2D6A2D] outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1A1A] text-white py-3 rounded-xl font-bold hover:bg-red-900 transition-colors shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* SECTION 4 - LOCATION CARD */}
        <section className="max-w-xl mx-auto">
          <div className="bg-[#f0f7f0] rounded-2xl p-8 text-center border border-green-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#2D6A2D] mb-4">📍 Based in Ramanathapuram, Tamil Nadu, India</h3>
            <p className="text-gray-600 mb-6">
              We deliver across Tamil Nadu. For outstation orders, please contact us via WhatsApp.
            </p>
            
            {/* Map Placeholder */}
            <div className="bg-[#2D6A2D] bg-opacity-20 rounded-xl h-32 flex items-center justify-center">
              <span className="text-[#2D6A2D] font-bold text-lg">Ramanathapuram, TN 📍</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
