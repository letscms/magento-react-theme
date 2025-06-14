import React from 'react'

function Faqs() {
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">What is your return policy?</h2>
          <p>We offer a 30-day return policy on all items. Please ensure the items are in their original condition.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">How long does shipping take?</h2>
          <p>Shipping typically takes 5-7 business days, depending on your location.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Do you ship internationally?</h2>
          <p>Yes, we ship to select international locations. Please check our shipping policy for more details.</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Still have questions?</h2>
        <p>If you have any other questions, feel free to <a href="/contact" className="text-blue-500 hover:underline">contact us</a>.</p>
      </div>
    </div>    
   
    
    </>
  )
}

export default Faqs