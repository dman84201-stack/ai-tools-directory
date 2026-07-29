import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to StackFind
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-6">About StackFind</h1>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <p className="text-lg">StackFind is a curated directory of AI tools, built to help builders, marketers, and teams find the right AI software for their stack without wading through endless listicles and outdated roundups.</p>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">What We Do</h2>
            <p>We organize AI tools by category — writing, design, coding, marketing, productivity, video, audio, and research — and let you search naturally to find what fits. Every tool listed is reviewed before it goes live.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">How Listings Work</h2>
            <p>Anyone can submit a tool for free consideration. We also offer paid featured placements for tool builders who want extra visibility — featured listings are clearly labeled as such, so they're never confused with organic results.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Get in Touch</h2>
            <p>Have a tool to submit, a correction to suggest, or a question? Visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link> or <Link href="/submit" className="text-blue-600 hover:underline">submit your tool</Link> directly.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
