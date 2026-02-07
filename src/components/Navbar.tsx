import { NavLink } from "react-router";

const links = [
  { to: "/", label: "Introduction" },
  { to: "/simulator", label: "Simulator" },
];

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <span className="text-lg font-bold tracking-tight">
          Fiscal Justice WA
        </span>
        <ul className="flex gap-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
