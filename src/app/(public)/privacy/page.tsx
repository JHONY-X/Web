import { ShieldCheck, Lock, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Data Protection & Privacy</h1>
          <p className="text-slate-500 mt-2">Prototype notice — pending Rohobot legal review</p>
        </div>

        <div role="note" className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This is a front-end prototype, not a finalized privacy policy. Do not submit real personal,
          identity, license, or payment information. Production data handling and security controls
          require implementation and legal review before launch.
        </div>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-primary-600" /> 1. Introduction
            </h2>
            <p>
              This page describes intended privacy practices for Rohobot Home-Based Health Care Service PLC (&quot;Rohobot&quot;). It is a product-design draft and does not establish that production data collection, storage, or legal compliance controls are active.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-primary-600" /> 2. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Planned candidate data:</strong> Name, contact information, professional credentials, and employment preferences.</li>
              <li><strong>Planned employer data:</strong> Organization and authorized representative details.</li>
              <li><strong>Planned platform data:</strong> Search history, interview records, and feedback for matching and auditing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Support professional credential verification.</li>
              <li>Match candidates with suitable employers.</li>
              <li>Coordinate interviews and track employment placements.</li>
              <li>Support subscription payments and receipts through an approved provider.</li>
              <li>Meet applicable legal and audit requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Data Sharing and Confidentiality</h2>
            <p>
              The intended design is to keep sensitive documents (such as identity cards and licenses) from direct employer access. This prototype does not implement production document storage or enforce that policy.
            </p>
            <p className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
              <strong>Employer feedback:</strong> The intended policy is to restrict evaluations to authorized administrators. Production access controls and confidentiality enforcement are not implemented in this prototype.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Your Rights</h2>
            <p>The final privacy notice should explain applicable rights, which may include:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request corrections to inaccurate information.</li>
              <li>Withdraw consent (which may affect your ability to use recruitment services).</li>
              <li>Request deletion of your data, subject to legal retention requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Security Measures</h2>
            <p>
              Production safeguards such as verified role-based access, encryption, audit logging, and multi-factor authentication must be implemented and independently reviewed before real personal information is handled. This prototype does not provide those controls.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Contact Us</h2>
            <p>Publish an approved Rohobot privacy contact here before launch.</p>
          </section>
        </div>
      </div>
    </div>
  );
}