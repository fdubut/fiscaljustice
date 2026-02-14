import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-civic-50 text-civic-900">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-civic-900 text-civic-300 text-center text-sm py-6">
        <p className="font-heading font-bold text-civic-200 mb-1">Fiscal Justice WA</p>
        <p className="mb-2">Building a fairer tax system for all Washingtonians.</p>
        <div className="flex justify-center gap-4 text-xs">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <a href="/simulator" className="hover:text-white transition-colors">Simulator</a>
        </div>
        <p className="mt-3 text-civic-400 text-xs">© {new Date().getFullYear()} Fiscal Justice WA</p>
      </footer>
    </div>
  );
}
