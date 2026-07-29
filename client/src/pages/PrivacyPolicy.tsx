import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to StackFind
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: July 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Overview</h2>
            <p>StackFind ("we", "us", "our") operates the website stackfind.cc (the "Site"), an online directory of AI tools. This Privacy Policy explains what information we collect, how we use it, and the choices you have.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Information We Collect</h2>
            <p>When you submit a tool for listing, we collect the information you provide, including your name, email address, and details about the tool being submitted. We do not require account creation to browse the Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Cookies and Advertising</h2>
            <p>This Site uses cookies and similar tracking technologies to operate and improve the Site, and to serve advertisements. We use Google AdSense, a third-party advertising service. Google, as a third-party vendor, uses cookies to serve ads on this Site based on your prior visits to this and other websites.</p>
            <p>Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this Site and/or other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google's Ads Settings</a>.</p>
            <p>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to this site and/or other sites on the Internet.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">4. How We Use Information</h2>
            <p>We use the information we collect to operate and maintain the Site, review and approve tool submissions, process payments for featured placements, and communicate with submitters about their listings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">5. Payment Processing</h2>
            <p>Featured placement payments are processed by PayPal. We do not store your payment card details; these are handled directly by PayPal in accordance with their own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">6. Third-Party Links</h2>
            <p>The Site contains links to external websites for the AI tools we list. We are not responsible for the privacy practices or content of these third-party sites.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">7. Your Choices</h2>
            <p>You can control cookies through your browser settings. Disabling cookies may affect how the Site functions. You may also opt out of personalized ads through <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google's Ads Settings</a> or via <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aboutads.info</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please reach out via our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
