import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, MessageCircle, ArrowRight } from 'lucide-react';

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
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    const message = `New enquiry from ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}
Subject: ${formData.subject}
Message: ${formData.message}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919952981365?text=${encodedMessage}`;

    alert("Message sent! We'll get back to you soon 🌿");
    window.open(whatsappUrl, '_blank');
    
    setFormData({ name: '', email: '', phone: '', subject: 'Product Enquiry', message: '' });
  };

  return (
    <div className="bg-[#FDFAF5] min-h-[calc(100vh-88px)] font-sans pb-24">
      
      {/* 1. HERO SECTION */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-serif font-bold mb-4 sm:mb-6">Let's talk naturally.</h1>
          <p className="text-[#a8d3b8] text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about our traditional recipes, want to place a bulk order, or just want to say hello — we're here for you.
          </p>
          </motion.div>
        </section>
      </div>

      {/* 2. SPLIT LAYOUT: INFO & FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 -mt-20 sm:-mt-24 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:w-5/12 flex flex-col gap-6">
            
            {/* WhatsApp Card */}
            <motion.a 
              href="https://wa.me/919952981365"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group hover:shadow-xl transition-all cursor-pointer shrink-0"
            >
              <div className="bg-[#eaf2eb] w-14 h-14 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#1a3a28] transition-colors">
                <MessageCircle className="w-6 h-6 text-[#2D5A40] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1a3a28] mb-2">Chat with us</h3>
                <p className="text-gray-500 font-medium mb-3">Fastest way to get answers.</p>
                <div className="text-[#2D5A40] font-bold flex items-center gap-2 group-hover:text-[#1a3a28] transition-colors">
                  +91 99529 81365 <ArrowRight className="w-4 h-4 shrink-0" />
                </div>
              </div>
            </motion.a>

            {/* Email Card */}
            <motion.a 
              href="mailto:thaaragainaturals@gmail.com"
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group hover:shadow-xl transition-all cursor-pointer overflow-hidden shrink-0"
            >
              <div className="bg-[#eaf2eb] w-14 h-14 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#1a3a28] transition-colors">
                <Mail className="w-6 h-6 text-[#2D5A40] group-hover:text-white transition-colors" />
              </div>
              <div className="w-full">
                <h3 className="text-xl font-bold text-[#1a3a28] mb-2">Email us</h3>
                <p className="text-gray-500 font-medium mb-3">For business and bulk queries.</p>
                <div className="text-[#2D5A40] font-bold flex items-center gap-2 group-hover:text-[#1a3a28] transition-colors break-all">
                  thaaragainaturals@gmail.com <ArrowRight className="w-4 h-4 shrink-0 hidden sm:block" />
                </div>
              </div>
            </motion.a>

            {/* Instagram Card */}
            <motion.a 
              href="https://instagram.com/thaaragainaturals"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group hover:shadow-xl transition-all cursor-pointer shrink-0"
            >
              <div className="bg-[#eaf2eb] w-14 h-14 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#1a3a28] transition-colors">
                <svg className="w-6 h-6 text-[#2D5A40] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
              <div className="w-full">
                <h3 className="text-xl font-bold text-[#1a3a28] mb-2">Follow our journey</h3>
                <p className="text-gray-500 font-medium mb-3">Join our growing community.</p>
                <div className="text-[#2D5A40] font-bold flex items-center gap-2 group-hover:text-[#1a3a28] transition-colors break-all">
                  @thaaragainaturals <ArrowRight className="w-4 h-4 shrink-0 hidden sm:block" />
                </div>
              </div>
            </motion.a>

            {/* Location & Socials */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col gap-6 h-full group hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="bg-[#eaf2eb] w-14 h-14 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#1a3a28] transition-colors">
                  <MapPin className="w-6 h-6 text-[#2D5A40] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3a28] mb-2">Visit Our Store</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    Ramanathapuram,<br className="hidden sm:block" />Tamil Nadu, India
                  </p>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="flex-grow w-full relative min-h-[200px] rounded-2xl overflow-hidden shadow-inner border border-black/5 group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.7173042419417!2d78.8784422!3d9.358265000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0197368e4b346b%3A0x2e83f9c4d6a50827!2sThaaragai%20Naturals!5e0!3m2!1sen!2sin!4v1780942237806!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>
            </motion.div>

          </div>

          {/* Right: Form */}
          <div className="lg:w-7/12">
            <div className="bg-white p-6 sm:p-10 md:p-14 rounded-[2rem] shadow-xl border border-gray-100 h-full overflow-hidden">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1a3a28] mb-8 sm:mb-10">Send an Enquiry</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 py-3 bg-transparent focus:outline-none focus:border-[#2D5A40] transition-colors text-lg text-[#1a3a28] placeholder-gray-400 font-medium"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 py-3 bg-transparent focus:outline-none focus:border-[#2D5A40] transition-colors text-lg text-[#1a3a28] placeholder-gray-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 py-3 bg-transparent focus:outline-none focus:border-[#2D5A40] transition-colors text-lg text-[#1a3a28] placeholder-gray-400 font-medium"
                    />
                  </div>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 py-3 bg-transparent focus:outline-none focus:border-[#2D5A40] transition-colors text-lg text-[#1a3a28] font-medium appearance-none cursor-pointer"
                    >
                      <option value="Product Enquiry">Product Enquiry</option>
                      <option value="Bulk Order">Bulk Order</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    name="message"
                    required
                    placeholder="How can we help you? *"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full border-b-2 border-gray-200 py-3 bg-transparent focus:outline-none focus:border-[#2D5A40] transition-colors text-lg text-[#1a3a28] placeholder-gray-400 font-medium resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="bg-[#1a3a28] text-white px-10 py-4 rounded-full font-bold hover:bg-[#2D5A40] transition-colors mt-6 w-full md:w-auto text-lg shadow-lg flex items-center justify-center gap-3 group"
                >
                  Send Message <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Creative Gap Filler: The Thaaragai Promise */}
              <div className="mt-auto pt-16">
                <div className="border-t border-gray-100 pt-8">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">The Thaaragai Promise</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Value 1 */}
                    <div className="flex flex-col gap-2 group">
                      <div className="w-10 h-10 rounded-full bg-[#eaf2eb] flex items-center justify-center mb-2 group-hover:bg-[#1a3a28] transition-colors">
                        <svg className="w-5 h-5 text-[#2D5A40] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-[#1a3a28]">100% Natural</p>
                      <p className="text-xs text-gray-500 font-medium pr-2">No chemicals, no preservatives. Just pure ingredients from earth.</p>
                    </div>
                    
                    {/* Value 2 */}
                    <div className="flex flex-col gap-2 group">
                      <div className="w-10 h-10 rounded-full bg-[#eaf2eb] flex items-center justify-center mb-2 group-hover:bg-[#1a3a28] transition-colors">
                        <svg className="w-5 h-5 text-[#2D5A40] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-[#1a3a28]">Made with Love</p>
                      <p className="text-xs text-gray-500 font-medium pr-2">Handcrafted in small batches to ensure the highest quality and taste.</p>
                    </div>

                    {/* Value 3 */}
                    <div className="flex flex-col gap-2 group">
                      <div className="w-10 h-10 rounded-full bg-[#eaf2eb] flex items-center justify-center mb-2 group-hover:bg-[#1a3a28] transition-colors">
                        <svg className="w-5 h-5 text-[#2D5A40] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-[#1a3a28]">Traditional Wisdom</p>
                      <p className="text-xs text-gray-500 font-medium pr-2">Rooted in ancient Tamil recipes passed down through generations.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
