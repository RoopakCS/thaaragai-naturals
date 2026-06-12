import React, { useEffect } from 'react';

export default function ReturnPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#eaf2eb] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
        <div className="px-6 py-10 sm:px-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a3a28] mb-8 text-center">Return &amp; Refund Policy</h1>
          
          <div className="prose prose-green max-w-none text-gray-600">
            <p className="text-lg leading-relaxed mb-8">
              At Thaaragai Naturals, we strive to deliver the highest quality traditional and natural products. 
              Because most of our products are food items and personal care goods, we have specific guidelines 
              to ensure safety and hygiene for all our customers.
            </p>

            <h2 className="text-xl font-bold text-[#2D6A2D] mt-8 mb-4">1. Eligibility for Returns</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><strong>Perishable and Food Items:</strong> We <strong>do not</strong> accept returns on food or perishable items due to hygiene and safety reasons, unless the product arrives damaged or defective.</li>
              <li><strong>Damaged or Defective Items:</strong> If you receive a product that is damaged during transit or is defective, you are eligible for a replacement or a full refund.</li>
            </ul>

            <h2 className="text-xl font-bold text-[#2D6A2D] mt-8 mb-4">2. Time Frame to Report Issues</h2>
            <p className="mb-6">
              If your item is damaged or defective, you must report the issue to us within <strong>7 days</strong> of the delivery date. 
              Reports made after 7 days will not be eligible for a refund or replacement.
            </p>

            <h2 className="text-xl font-bold text-[#2D6A2D] mt-8 mb-4">3. The Return Process</h2>
            <p className="mb-6">
              We try to make things as easy as possible for you. <strong>You do not need to ship the damaged item back to us.</strong> 
              To request a refund or replacement:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Contact us at <a href="mailto:thaaragainaturals@gmail.com" className="text-[#2D6A2D] underline">thaaragainaturals@gmail.com</a> or via WhatsApp at <strong>+91 99529 81365</strong>.</li>
              <li>Provide your order number and clear photographic proof of the damaged or defective item.</li>
              <li>Once we review and approve the photo proof, we will immediately process a replacement or a full refund to your original payment method.</li>
            </ol>

            <h2 className="text-xl font-bold text-[#2D6A2D] mt-8 mb-4">4. Refunds</h2>
            <p className="mb-6">
              Approved refunds will be processed within 5-7 business days. The time it takes for the funds to appear in your account 
              depends on your bank or payment provider.
            </p>

            <h2 className="text-xl font-bold text-[#2D6A2D] mt-8 mb-4">5. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about our Returns and Refunds Policy, please contact us:
            </p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> thaaragainaturals@gmail.com</li>
              <li><strong>Phone/WhatsApp:</strong> +91 99529 81365</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
