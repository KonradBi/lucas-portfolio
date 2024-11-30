export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#010208] py-32">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-light text-white mb-12">Privacy Policy</h1>
        
        <div className="space-y-8 text-white/70">
          <section>
            <h2 className="text-xl text-white mb-4">1. Data Collection</h2>
            <p>We collect and process the following data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Contact information when you use our contact form (email address and message content)</li>
              <li>Technical data (IP address, browser type, timestamp) through our hosting provider Vercel</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white mb-4">2. Purpose of Data Collection</h2>
            <p>Your data is collected to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Process and respond to your inquiries</li>
              <li>Ensure the security and functionality of our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white mb-4">3. Data Storage</h2>
            <p>Your data is stored on servers within the European Union. We only keep your data for as long as necessary to fulfill the purposes mentioned above.</p>
          </section>

          <section>
            <h2 className="text-xl text-white mb-4">4. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Request information about your stored data</li>
              <li>Request correction or deletion of your data</li>
              <li>Restrict data processing</li>
              <li>Data portability</li>
              <li>File a complaint with the relevant supervisory authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white mb-4">5. Contact</h2>
            <p>For privacy-related concerns, please contact:</p>
            <p>Email: [Your Contact Email]</p>
          </section>
        </div>
      </div>
    </div>
  );
} 