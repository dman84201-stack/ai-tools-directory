import { Link } from "wouter";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

// TODO: replace with a real inbox you actually check before launch.
const CONTACT_EMAIL = "toolmint9@gmail.com";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to StackFind
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-6">Contact Us</h1>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <p className="text-lg">Have a question, want to submit a tool, or spotted something that needs fixing? We'd like to hear from you.</p>

          <div className="bg-white rounded-lg border border-slate-200 p-6 flex items-center gap-4">
            <div className="bg-blue-50 rounded-full p-3">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Email us at</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg font-medium text-slate-900 hover:text-blue-600">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <p>Want to get your AI tool listed? You can also <Link href="/submit" className="text-blue-600 hover:underline">submit it directly</Link> — no need to email first.</p>
        </div>

        <Button asChild className="mt-4">
          <a href={`mailto:${CONTACT_EMAIL}`}>Send us an email</a>
        </Button>
      </div>
    </div>
  );
}
