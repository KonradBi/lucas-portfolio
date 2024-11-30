export default function ImprintPage() {
  return (
    <div className="min-h-screen bg-[#010208] py-32">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-light text-white mb-12">Imprint</h1>
        
        <div className="space-y-8 text-white/70">
          <section>
            <h2 className="text-xl text-white mb-4">Information according to § 5 TMG</h2>
            <p>LVDV Art</p>
            <p>[Your Street and Number]</p>
            <p>[Your Postal Code and City]</p>
            <p>Germany</p>
          </section>

          <section>
            <h2 className="text-xl text-white mb-4">Contact</h2>
            <p>Email: [Your Contact Email]</p>
          </section>

          <section>
            <h2 className="text-xl text-white mb-4">Responsible for Content</h2>
            <p>[Your Full Name]</p>
          </section>
        </div>
      </div>
    </div>
  );
} 