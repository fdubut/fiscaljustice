import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-slate-800 text-slate-400 text-center text-sm py-4">
        © {new Date().getFullYear()} Fiscal Justice WA
      </footer>
    </div>
  );
}
