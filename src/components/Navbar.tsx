import { NavLink } from "react-router";

const links = [
  { to: "/", label: "Introduction" },
  { to: "/simulator", label: "Simulator" },
];

export default function Navbar() {
  return (
    <nav className="bg-civic-900 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <span className="font-heading text-lg font-bold tracking-tight">
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
                      ? "bg-civic-700 text-white"
                      : "text-civic-200 hover:text-white hover:bg-civic-800"
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
