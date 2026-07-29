import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} StackFind. All rights reserved.</p>
        <nav className="flex items-center gap-6 text-sm text-slate-500">
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/contact" className="hover:text-slate-900">Contact</Link>
          <Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
          <Link href="/submit" className="hover:text-slate-900">Submit a Tool</Link>
        </nav>
      </div>
    </footer>
  );
}
