import { useState, useEffect } from "react";
import api from "./api";
import {
  Search, MapPin, Bell, ChevronDown, Menu, X, Home, Pill, Building2,
  Users, BarChart3, Settings, LogOut, Star, Phone, Clock, Navigation,
  Package, ShoppingBag, CheckCircle, XCircle, AlertTriangle, TrendingUp,
  FileText, Shield, ChevronRight, Plus, Edit2, Eye,  Trash2, ArrowLeft, Filter,
  RefreshCw, Download, User, Lock, Globe, HelpCircle, Stethoscope
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

type Page =
  | "home" | "login" | "register" | "forgot-password"
  | "user-dashboard"
  | "medicine-search"
  | "medicine-details"
  | "my-reservations"
  | "price-comparison"
  | "pharmacy-locator"
  | "pharmacy-dashboard"
  | "pharmacy-inventory"
  | "pharmacy-reservations"
  | "pharmacy-profile"
  | "admin-dashboard"
  | "admin-user-management"
  | "admin-pharmacy-approval"
  | "admin-medicine-management"
  | "reports"
  | "settings";

type Panel = "public" | "user" | "pharmacy" | "admin";


const MEDICINES = [
  { id: 1, name: "Napa Extra", generic: "Paracetamol + Caffeine", mfr: "Beximco Pharma", strength: "500mg+65mg", category: "Analgesic", price: 35, available: 3, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&h=80&fit=crop&auto=format" },
  { id: 2, name: "Seclo 20", generic: "Omeprazole", mfr: "Square Pharma", strength: "20mg", category: "GIT", price: 8, available: 5, img: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=80&h=80&fit=crop&auto=format" },
  { id: 3, name: "Azithro 500", generic: "Azithromycin", mfr: "Aristopharma", strength: "500mg", category: "Antibiotic", price: 65, available: 2, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=80&h=80&fit=crop&auto=format" },
  { id: 4, name: "Montiget 10", generic: "Montelukast", mfr: "Renata Ltd.", strength: "10mg", category: "Respiratory", price: 18, available: 4, img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=80&h=80&fit=crop&auto=format" },
  { id: 5, name: "Losectil 500", generic: "Cefuroxime", mfr: "ACI Ltd.", strength: "500mg", category: "Antibiotic", price: 120, available: 1, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&h=80&fit=crop&auto=format" },
  { id: 6, name: "Fexo 120", generic: "Fexofenadine", mfr: "Square Pharma", strength: "120mg", category: "Antihistamine", price: 12, available: 6, img: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=80&h=80&fit=crop&auto=format" },
];

const PHARMACIES = [
  { id: 1, name: "Dhaka Medical Pharmacy", area: "Shahbag, Dhaka", distance: "0.4 km", phone: "01711-234567", hours: "24 Hours", rating: 4.8, stock: 342 },
  { id: 2, name: "Popular Drug House", area: "Dhanmondi, Dhaka", distance: "0.8 km", phone: "01812-345678", hours: "8AM–10PM", rating: 4.5, stock: 218 },
  { id: 3, name: "City Pharmacy", area: "Gulshan-1, Dhaka", distance: "1.2 km", phone: "01911-456789", hours: "8AM–11PM", rating: 4.3, stock: 185 },
  { id: 4, name: "ABC Medicine Corner", area: "Mirpur-10, Dhaka", distance: "2.1 km", phone: "01611-567890", hours: "9AM–9PM", rating: 4.1, stock: 97 },
];

const salesData = [
  { day: "Mon", reservations: 24, customers: 18 },
  { day: "Tue", reservations: 31, customers: 25 },
  { day: "Wed", reservations: 28, customers: 22 },
  { day: "Thu", reservations: 42, customers: 35 },
  { day: "Fri", reservations: 38, customers: 30 },
  { day: "Sat", reservations: 55, customers: 47 },
  { day: "Sun", reservations: 19, customers: 15 },
];

const searchData = [
  { name: "Napa Extra", searches: 1240 },
  { name: "Seclo 20", searches: 980 },
  { name: "Azithro 500", searches: 870 },
  { name: "Montiget 10", searches: 650 },
  { name: "Fexo 120", searches: 520 },
];

const categoryData = [
  { name: "Analgesic", value: 28, color: "#2563eb" },
  { name: "Antibiotic", value: 22, color: "#16a34a" },
  { name: "GIT", value: 18, color: "#f59e0b" },
  { name: "Respiratory", value: 15, color: "#8b5cf6" },
  { name: "Other", value: 17, color: "#64748b" },
];

const INVENTORY = [
  { id: 1, name: "Napa Extra", generic: "Paracetamol+Caffeine", stock: 45, price: 35, status: "Available" },
  { id: 2, name: "Seclo 20", generic: "Omeprazole", stock: 12, price: 8, status: "Low Stock" },
  { id: 3, name: "Azithro 500", generic: "Azithromycin", stock: 0, price: 65, status: "Out of Stock" },
  { id: 4, name: "Montiget 10", generic: "Montelukast", stock: 88, price: 18, status: "Available" },
  { id: 5, name: "Losectil 500", generic: "Cefuroxime", stock: 7, price: 120, status: "Low Stock" },
  { id: 6, name: "Fexo 120", generic: "Fexofenadine", stock: 62, price: 12, status: "Available" },
];

const RESERVATIONS = [
  { id: "RES-001", patient: "Rafiqul Islam", medicine: "Napa Extra", qty: 2, date: "27 Jun 2026", status: "Pending" },
  { id: "RES-002", patient: "Nasima Begum", medicine: "Seclo 20", qty: 1, date: "27 Jun 2026", status: "Approved" },
  { id: "RES-003", patient: "Karim Hossain", medicine: "Fexo 120", qty: 3, date: "26 Jun 2026", status: "Completed" },
  { id: "RES-004", patient: "Sadia Akter", medicine: "Azithro 500", qty: 1, date: "26 Jun 2026", status: "Rejected" },
  { id: "RES-005", patient: "Tanvir Ahmed", medicine: "Montiget 10", qty: 2, date: "25 Jun 2026", status: "Completed" },
];






const PENDING_PHARMACIES = [
  { id: 1, name: "HealthPlus Pharmacy", owner: "Mizanur Rahman", area: "Uttara, Dhaka", applied: "25 Jun 2026", license: "DDA-2026-1234" },
  { id: 2, name: "MediCare Drug Store", owner: "Farida Yasmin", area: "Motijheel, Dhaka", applied: "24 Jun 2026", license: "DDA-2026-1235" },
  { id: 3, name: "Green Cross Pharmacy", owner: "Shafiqul Alam", area: "Banani, Dhaka", applied: "23 Jun 2026", license: "DDA-2026-1236" },
];


// ─── Shared UI primitives ────────────────────────────────────────────────────

function Badge({ label, variant }: { label: string; variant: "green" | "blue" | "red" | "yellow" | "gray" }) {
  const map = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-amber-100 text-amber-700",
    gray: "bg-slate-100 text-slate-600",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[variant]}`}>{label}</span>;
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Public Navbar ───────────────────────────────────────────────────────────

function PublicNavbar({ setPage, setPanel }: { setPage: (p: Page) => void; setPanel: (p: Panel) => void }) {
  return (
    <nav className="bg-white shadow-sm border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">Medi<span className="text-blue-600">Find</span> <span className="text-green-600">BD</span></span>
        </button>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <button onClick={() => setPage("home")} className="hover:text-blue-600 transition-colors">Home</button>
          <button onClick={() => setPage("medicine-search")} className="hover:text-blue-600 transition-colors">Find Medicine</button>
          <button onClick={() => setPage("pharmacy-locator")} className="hover:text-blue-600 transition-colors">Pharmacies</button>
          <button onClick={() => setPage("login")} className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">Sign In</button>
          <button onClick={() => setPage("register")} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Register</button>
        </div>
      </div>
    </nav>
  );
}

// ─── Dashboard Sidebar ───────────────────────────────────────────────────────

function Sidebar({ panel, page, setPage, setPanel }: { panel: Panel; page: Page; setPage: (p: Page) => void; setPanel: (p: Panel) => void }) {
  const userLinks = [
    { icon: Home, label: "Dashboard", page: "user-dashboard" as Page },
    { icon: Search, label: "Find Medicine", page: "medicine-search" as Page },
    { icon: MapPin, label: "Pharmacy Locator", page: "pharmacy-locator" as Page },
    { icon: ShoppingBag, label: "My Reservations", page: "my-reservations" as Page },
    { icon: Settings, label: "Settings", page: "settings" as Page },
  ];
  const pharmacyLinks = [
    { icon: Home, label: "Dashboard", page: "pharmacy-dashboard" as Page },
    { icon: Package, label: "Inventory", page: "pharmacy-inventory" as Page },
    { icon: ShoppingBag, label: "Reservations", page: "pharmacy-reservations" as Page },
    { icon: Building2, label: "My Profile", page: "pharmacy-profile" as Page },
    { icon: BarChart3, label: "Reports", page: "reports" as Page },
    { icon: Settings, label: "Settings", page: "settings" as Page },
  ];
  const adminLinks = [
    { icon: Home, label: "Dashboard", page: "admin-dashboard" as Page },
    { icon: Building2, label: "Pharmacy Approval", page: "admin-pharmacy-approval" as Page },
    { icon: Pill, label: "Medicine Master", page: "admin-medicine-management" as Page },
    { icon: Users, label: "User Management", page: "admin-user-management" as Page },
    { icon: BarChart3, label: "Reports", page: "reports" as Page },
    { icon: Settings, label: "Settings", page: "settings" as Page },
  ];

  const links = panel === "user" ? userLinks : panel === "pharmacy" ? pharmacyLinks : adminLinks;
  const panelLabel = panel === "user" ? "User Panel" : panel === "pharmacy" ? "Pharmacy Panel" : "Admin Panel";
  const panelColor = panel === "user" ? "text-blue-600" : panel === "pharmacy" ? "text-green-600" : "text-purple-600";

  return (
    <aside className="w-64 bg-white border-r border-black/5 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-black/5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-800">Medi<span className="text-blue-600">Find</span></span>
        </div>
        <p className={`text-xs font-semibold ${panelColor} uppercase tracking-wider ml-10`}>{panelLabel}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ icon: Icon, label, page: p }) => (
          <button
            key={p + label}
            onClick={() => setPage(p)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              page === p
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-black/5 space-y-2">
        {panel !== "admin" && (
          <button
            onClick={() => { setPage("admin-dashboard"); setPanel("admin"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 transition-all"
          >
            <Shield size={18} />Admin Panel
          </button>
        )}
        <button
          onClick={() => { setPage("home"); setPanel("public"); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all"
        >
          <LogOut size={18} />Sign Out
        </button>
      </div>
    </aside>
  );
}

function DashboardNav({ panel }: { panel: Panel }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const labels = {
    public: "",
    user: user.full_name || "",
    pharmacy: user.full_name || "",
    admin: "Administrator"
};
  return (
    <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-6 sticky top-0 z-40">
      <div />
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <Bell size={20} className="text-slate-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            <User size={18} className="text-blue-600" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-800">{labels[panel]}</p>
            <p className="text-xs text-slate-400 capitalize">{panel === "public" ? "" : panel + " account"}</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function HomePage({
  setPage,
  setPanel,
  setSelectedMedicine,
}: {
  setPage: (p: Page) => void;
  setPanel: (p: Panel) => void;
  setSelectedMedicine: (medicine: any) => void;
}) {
  const [query, setQuery] = useState("");
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar setPage={setPage} setPanel={setPanel} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)" }} />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Bangladesh&apos;s First Medicine Finder Platform
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Find Your Medicine<br /><span className="text-green-300">Near You</span>
            </h1>
            <p className="text-blue-100 text-lg mb-10">
              Search medicine availability, compare prices across registered pharmacies, and reserve medicines — all in one place.
            </p>
            <div className="bg-white rounded-2xl p-2 flex gap-2 shadow-xl max-w-xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search size={20} className="text-slate-400 flex-shrink-0" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by brand name, generic name..."
                  className="flex-1 outline-none text-slate-700 text-sm bg-transparent"
                />
              </div>
              <button
                onClick={() => setPage("medicine-search")}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setPage("pharmacy-locator")}
                className="flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors"
              >
                <MapPin size={16} />
                Find Nearby Pharmacy
              </button>
              <span className="text-blue-300">·</span>
              <span className="text-sm text-blue-200">Emergency? Call 16367</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 hidden lg:block"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=500&fit=crop&auto=format')", backgroundSize: "cover", backgroundPosition: "center" }} />
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-4 gap-6 text-center">
          {[["1,240+", "Medicines Listed"], ["86", "Registered Pharmacies"], ["24/7", "Emergency Search"], ["50K+", "Searches Daily"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-2xl font-bold text-blue-600">{v}</p>
              <p className="text-sm text-slate-500">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Medicines */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Popular Medicines</h2>
            <p className="text-slate-500 text-sm mt-1">Most searched today</p>
          </div>
          <button onClick={() => setPage("medicine-search")} className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {MEDICINES.slice(0, 6).map(med => (
            <div key={med.id} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Pill size={28} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800">{med.name}</h3>
                  <p className="text-xs text-slate-400">{med.generic}</p>
                  <p className="text-xs text-slate-400">{med.mfr}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Available at</p>
                  <p className="text-sm font-semibold text-green-600">{med.available} Pharmacies</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">From</p>
                  <p className="text-lg font-bold text-blue-600">৳{med.price}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setPage("price-comparison")} className="flex-1 py-2 text-xs font-semibold rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">Compare</button>
                <button onClick={() => setPage("medicine-details")} className="flex-1 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Reserve</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Pharmacies */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Nearby Registered Pharmacies</h2>
              <p className="text-slate-500 text-sm mt-1">Verified & licensed pharmacies near you</p>
            </div>
            <button onClick={() => setPage("pharmacy-locator")} className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
              View Map <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {PHARMACIES.map(ph => (
              <div key={ph.id} className="rounded-2xl border border-black/5 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Building2 size={20} className="text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                    <Star size={12} fill="currentColor" />
                    {ph.rating}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{ph.name}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin size={10} />{ph.area}</p>
                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-2"><Navigation size={10} className="text-blue-400" />{ph.distance}</p>
                  <p className="flex items-center gap-2"><Clock size={10} className="text-green-500" />{ph.hours}</p>
                </div>
                <button onClick={() => setPage("pharmacy-locator")} className="mt-4 w-full py-2 text-xs font-semibold rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition-colors">
                  Get Directions
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Why MediFind BD?</h2>
        <p className="text-slate-500 text-sm text-center mb-10">Smart medicine access for every Bangladeshi</p>
        <div className="grid grid-cols-4 gap-6">
          {[
            { icon: Search, title: "Smart Search", desc: "Search by brand name, generic name, or category with instant results", color: "bg-blue-100 text-blue-600" },
            { icon: BarChart3, title: "Price Comparison", desc: "Compare prices across multiple pharmacies to get the best deal", color: "bg-green-100 text-green-600" },
            { icon: ShoppingBag, title: "Reserve Medicine", desc: "Reserve medicines online and pick up at your convenience", color: "bg-amber-100 text-amber-600" },
            { icon: MapPin, title: "Locate Pharmacies", desc: "Find verified pharmacies near you with live availability data", color: "bg-purple-100 text-purple-600" },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 text-center">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mx-auto mb-4`}>
                <f.icon size={22} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Stethoscope size={14} className="text-white" />
              </div>
              <span className="font-bold text-white">MediFind BD</span>
            </div>
            <p className="text-xs leading-relaxed">Bangladesh&apos;s trusted medicine finder platform connecting patients with registered pharmacies.</p>
          </div>
          {[
            { title: "Platform", links: ["Find Medicine", "Compare Prices", "Pharmacy Locator", "Emergency"] },
            { title: "For Pharmacies", links: ["Register Pharmacy", "Pharmacy Portal", "Inventory Manage", "Support"] },
            { title: "Contact", links: ["📞 16367 (Helpline)", "📧 info@medifindbd.com", "📍 Dhaka, Bangladesh", "⏰ 24/7 Support"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l} className="text-xs hover:text-white cursor-pointer transition-colors">{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-700 py-4 text-center text-xs">
          © 2026 MediFind BD. All rights reserved. Regulated by DGDA Bangladesh.
        </div>
      </footer>
    </div>
  );
}
function LoginPage({
  setPage,
  setPanel
}: {
  setPage: (p: Page) => void;
  setPanel: (p: Panel) => void;
}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    // ==============================
    // VALIDATION
    // ==============================

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    try {

      setLoading(true);

      // ==============================
      // LOGIN API
      // ==============================

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      );

      const data = await response.json();

      // ==============================
      // LOGIN SUCCESS
      // ==============================

      if (data.success) {

        console.log("Login successful:", data.user);

        // Save JWT
        localStorage.setItem(
          "token",
          data.token
        );

        // Save complete user
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Save role
        localStorage.setItem(
          "role",
          data.user.role
        );

        // ==============================
        // ROLE BASED REDIRECT
        // ==============================

        if (data.user.role === "customer") {

          setPanel("user");
          setPage("user-dashboard");

        }

        else if (data.user.role === "pharmacy") {

          setPanel("pharmacy");
          setPage("pharmacy-dashboard");

        }

        else if (data.user.role === "admin") {

          setPanel("admin");
          setPage("admin-dashboard");

        }

        else {

          alert("Unknown user role.");

        }

      }

      // ==============================
      // LOGIN FAILED
      // ==============================

      else {

        alert(
          data.message || "Login failed."
        );

      }

    }

    catch (error) {

      console.error(
        "Login error:",
        error
      );

      alert(
        "Cannot connect to the server. Make sure the backend is running."
      );

    }

    finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        {/* Logo / Header */}

        <div className="text-center mb-8">

          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">

            <Stethoscope
              size={26}
              className="text-white"
            />

          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Welcome Back
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Sign in to your MediFind BD account
          </p>

        </div>


        {/* Login Card */}

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">

          <div className="space-y-4">

            {/* Email */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Password */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />

            </div>


            {/* Remember / Forgot */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-600">

                <input
                  type="checkbox"
                  className="rounded"
                />

                Remember me

              </label>

              <button
                onClick={() =>
                  setPage("forgot-password")
                }
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </button>

            </div>

          </div>


          {/* Sign In Button */}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full mt-6 py-3 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {loading
              ? "Signing In..."
              : "Sign In"}

          </button>


          {/* Register */}

          <div className="mt-4 text-center text-sm text-slate-500">

            Don't have an account?{" "}

            <button
              onClick={() =>
                setPage("register")
              }
              className="text-blue-600 font-semibold hover:underline"
            >
              Register now
            </button>

          </div>

        </div>


        {/* Back Home */}

        <p className="text-center text-xs text-slate-400 mt-6">

          <button
            onClick={() =>
              setPage("home")
            }
            className="hover:text-blue-600"
          >
            ← Back to Home
          </button>

        </p>

      </div>

    </div>
  );
}

function RegisterPage({
  setPage
}: {
  setPage: (p: Page) => void
}) {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [address, setAddress] = useState("");

  const [role, setRole] = useState("customer");

  const [pharmacyName, setPharmacyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [loading, setLoading] = useState(false);


  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async () => {

    // ------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }


    // ------------------------------------------
    // PHARMACY VALIDATION
    // ------------------------------------------

    if (role === "pharmacy") {

      if (!pharmacyName.trim()) {
        alert("Please enter the pharmacy name.");
        return;
      }

      if (!licenseNumber.trim()) {
        alert("Please enter the DGDA license number.");
        return;
      }
    }


    try {

      setLoading(true);


      // ==========================================
      // SEND REGISTRATION REQUEST
      // ==========================================

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            full_name: fullName.trim(),

            email: email.trim(),

            phone: phone.trim(),

            password,

            address: address.trim(),

            role,

            // Pharmacy fields
            pharmacy_name:
              role === "pharmacy"
                ? pharmacyName.trim()
                : null,

            license_number:
              role === "pharmacy"
                ? licenseNumber.trim()
                : null

          })
        }
      );


      const data = await response.json();


      console.log(
        "Registration response:",
        data
      );


      // ==========================================
      // SUCCESS
      // ==========================================

      if (data.success) {

        if (role === "pharmacy") {

          alert(
            "Pharmacy registration submitted successfully. Your pharmacy is waiting for admin approval."
          );

        } else {

          alert(
            "Registration Successful!"
          );

        }


        // Clear form

        setFullName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setAddress("");

        setPharmacyName("");
        setLicenseNumber("");

        setRole("customer");


        // Go to login

        setPage("login");

      } else {

        alert(
          data.message ||
          "Registration failed."
        );

      }

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      alert(
        "Cannot connect to the server. Make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="text-center mb-8">

          <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-4">

            {role === "pharmacy" ? (
              <Building2
                size={26}
                className="text-white"
              />
            ) : (
              <User
                size={26}
                className="text-white"
              />
            )}

          </div>


          <h1 className="text-2xl font-bold text-slate-800">
            Create Account
          </h1>


          <p className="text-slate-500 text-sm mt-1">

            {role === "pharmacy"
              ? "Register your pharmacy with MediFind BD"
              : "Join MediFind BD as a customer"}

          </p>

        </div>


        {/* ==========================================
            FORM CARD
        ========================================== */}

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">

          <div className="space-y-4">


            {/* FULL NAME */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Md. Rahim"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* EMAIL */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* PHONE */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="017XXXXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* ADDRESS */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Address
              </label>

              <input
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Dhanmondi, Dhaka"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* REGISTER AS */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Register As
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
              >

                <option value="customer">
                  Customer
                </option>

                <option value="pharmacy">
                  Pharmacy
                </option>

              </select>

            </div>


            {/* ==========================================
                PHARMACY ONLY
            ========================================== */}

            {role === "pharmacy" && (

              <div className="space-y-4 pt-4 border-t border-slate-100">


                {/* PHARMACY NAME */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Pharmacy Name
                  </label>

                  <input
                    value={pharmacyName}
                    onChange={(e) =>
                      setPharmacyName(e.target.value)
                    }
                    placeholder="ABC Pharmacy"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  />

                </div>


                {/* LICENSE */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    DGDA License Number
                  </label>

                  <input
                    value={licenseNumber}
                    onChange={(e) =>
                      setLicenseNumber(e.target.value)
                    }
                    placeholder="DGDA-123456"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  />

                </div>


                {/* APPROVAL NOTICE */}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">

                  <p className="text-xs text-amber-700">

                    Pharmacy registrations require
                    admin approval before the pharmacy
                    can operate.

                  </p>

                </div>

              </div>

            )}

          </div>


          {/* ==========================================
              REGISTER BUTTON
          ========================================== */}

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full mt-6 py-3 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >

            {loading
              ? "Creating Account..."
              : role === "pharmacy"
                ? "Register Pharmacy"
                : "Create Account"}

          </button>


          {/* ==========================================
              LOGIN
          ========================================== */}

          <div className="mt-4 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <button
              onClick={() =>
                setPage("login")
              }
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign in
            </button>

          </div>

        </div>


        {/* BACK */}

        <p className="text-center text-xs text-slate-400 mt-6">

          <button
            onClick={() =>
              setPage("home")
            }
            className="hover:text-blue-600"
          >
            ← Back to Home
          </button>

        </p>

      </div>

    </div>
  );
}

function ForgotPasswordPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-4">
            <Lock size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
          <p className="text-slate-500 text-sm mt-1">Enter your phone number to receive an OTP</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="01XXXXXXXXX" />
          </div>
          <button className="w-full mt-5 py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors">
            Send OTP
          </button>
          <div className="mt-4 text-center">
            <button onClick={() => setPage("login")} className="text-sm text-slate-500 hover:text-blue-600">← Back to Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDashboard({ setPage }: { setPage: (p: Page) => void }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Good Morning, {user.full_name}! 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Find your medicine, compare prices, and stay healthy.</p>
      </div>

      {/* Quick search */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <p className="font-semibold mb-3">Quick Medicine Search</p>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/20 rounded-xl flex items-center gap-3 px-4 py-3">
            <Search size={18} className="text-blue-100" />
            <input className="flex-1 bg-transparent text-white placeholder:text-blue-200 text-sm outline-none" placeholder="Search medicine by name..." />
          </div>
          <button onClick={() => setPage("medicine-search")} className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <StatCard icon={Search} label="Searches Today" value="0" sub="Last: Napa Extra" color="bg-blue-500" />
        <StatCard icon={ShoppingBag} label="Active Reservations" value="2" sub="1 ready for pickup" color="bg-green-500" />
        <StatCard icon={Star} label="Saved Pharmacies" value="4" sub="Dhaka Medical is nearest" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Recent searches */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
          <h3 className="font-bold text-slate-800 mb-4">Recent Searches</h3>
          <div className="space-y-3">
            {[].map(m => (
              <div key={m} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Pill size={14} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{m}</span>
                </div>
                <button onClick={() => setPage("medicine-details")} className="text-xs text-blue-600 hover:underline">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Reserved medicines */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">My Reservations</h3>
            <button
              onClick={() => setPage("my-reservations")}
              className="text-xs text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>
          <p className="text-sm text-slate-500">
            View your active reservations and their approval status.
          </p>
          <button
            onClick={() => setPage("my-reservations")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Open My Reservations
          </button>
        </div>
      </div>

      {/* Favorite pharmacies */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
        <h3 className="font-bold text-slate-800 mb-4">Favorite Pharmacies</h3>
        <div className="grid grid-cols-4 gap-4">
          {[].map(ph => (
            <div key={ph.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer">
              <Building2 size={20} className="text-green-500 mb-2" />
              <p className="text-sm font-semibold text-slate-800">{ph.name}</p>
              <p className="text-xs text-slate-400">{ph.distance} away</p>
              <p className="text-xs text-green-600 mt-1">{ph.hours}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function MedicineSearchPage({
    setPage,
    setSelectedMedicine
}: {
    setPage: (p: Page) => void;
    setSelectedMedicine: (medicine: any) => void;
}) {

    const [medicines, setMedicines] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD MEDICINE AVAILABILITY
    // ==========================================

    const loadMedicines = async (searchText = "") => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/medicines/availability/search?search=${encodeURIComponent(searchText)}`
            );

            console.log(
                "Medicine availability response:",
                response.data
            );


            if (!response.data.success) {

                setMedicines([]);

                setError(
                    response.data.message ||
                    "Failed to load medicines."
                );

                return;
            }


            // ==========================================
            // GROUP PHARMACY RESULTS BY MEDICINE
            // ==========================================

            const grouped: Record<number, any> = {};


            (response.data.results || []).forEach(
                (item: any) => {

                    const medicineId =
                        Number(item.medicine_id);


                    if (!grouped[medicineId]) {

                        grouped[medicineId] = {

                            id: medicineId,

                            medicine_id: medicineId,

                            brand_name:
                                item.brand_name || "",

                            generic_name:
                                item.generic_name || "",

                            strength:
                                item.strength || "",

                            dosage_form:
                                item.dosage_form || "",

                            manufacturer:
                                item.manufacturer ||
                                item.mfr ||
                                "",

                            category:
                                item.category || "",

                            description:
                                item.description || "",

                            uses:
                                item.uses || "",

                            dosage:
                                item.dosage || "",

                            side_effects:
                                item.side_effects || "",

                            pharmacies: [],

                            available: 0,

                            price: 0
                        };
                    }


                    // Add pharmacy information
                    grouped[medicineId].pharmacies.push({
                        pharmacy_id: Number(item.pharmacy_id),
                        medicine_id: Number(item.medicine_id),

                        pharmacy_name: item.pharmacy_name || "",
                        address: item.address || "",
                        phone: item.phone || "",

                        latitude: item.latitude,
                        longitude: item.longitude,

                        stock: Number(item.stock) || 0,
                        price: Number(item.price) || 0,

                        brand_name: item.brand_name || "",
                        generic_name: item.generic_name || "",
                        strength: item.strength || "",
                        dosage_form: item.dosage_form || ""
                    });


                    // ==========================================
                    // COUNT AVAILABLE PHARMACIES
                    // ==========================================

                    if (
                        Number(item.stock) > 0
                    ) {

                        grouped[medicineId].available += 1;

                    }


                    // ==========================================
                    // FIND LOWEST PRICE
                    // ==========================================

                    const itemPrice =
                        Number(item.price) || 0;


                    if (
                        itemPrice > 0 &&
                        (
                            grouped[medicineId].price === 0 ||
                            itemPrice <
                            grouped[medicineId].price
                        )
                    ) {

                        grouped[medicineId].price =
                            itemPrice;

                    }

                }
            );


            setMedicines(
                Object.values(grouped)
            );

        } catch (error: any) {

            console.error(
                "Failed to load medicine availability:",
                error.response?.data || error
            );

            setMedicines([]);

            setError(
                error.response?.data?.message ||
                "Failed to connect to the server."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {

        loadMedicines("");

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = () => {

        loadMedicines(search.trim());

    };


    // ==========================================
    // CLEAR SEARCH
    // ==========================================

    const handleClearSearch = () => {

        setSearch("");

        loadMedicines("");

    };


    // ==========================================
    // SELECT MEDICINE
    // ==========================================

    const selectMedicine = (med: any) => {

        setSelectedMedicine(med);

        localStorage.setItem(
            "selectedMedicine",
            JSON.stringify(med)
        );

    };


    return (
        <div className="p-6 space-y-5">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div>

                <h1 className="text-2xl font-bold text-slate-800">
                    Find Medicine
                </h1>

                <p className="text-slate-500 text-sm mt-1">
                    Search medicines and compare prices across pharmacies
                </p>

            </div>


            {/* ==========================================
                SEARCH BOX
            ========================================== */}

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

                <div className="flex gap-3">

                    <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">

                        <Search
                            size={18}
                            className="text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    handleSearch();
                                }

                            }}
                            className="flex-1 outline-none text-sm text-slate-700"
                            placeholder="Search by brand name or generic name..."
                        />

                    </div>


                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >

                        {loading
                            ? "Searching..."
                            : "Search"
                        }

                    </button>

                </div>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">

                    <p className="text-sm font-semibold text-red-700">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            loadMedicines(search)
                        }
                        className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ==========================================
                RESULT COUNT
            ========================================== */}

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">

                    {loading
                        ? "Searching..."
                        : `${medicines.length} medicines found`
                    }

                </p>


                {search && !loading && (

                    <button
                        onClick={handleClearSearch}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Clear Search
                    </button>

                )}

            </div>


            {/* ==========================================
                LOADING
            ========================================== */}

            {loading && (

                <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

                    <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />

                    <p className="text-sm text-slate-500">
                        Searching medicines...
                    </p>

                </div>

            )}


            {/* ==========================================
                NO RESULTS
            ========================================== */}

            {!loading &&
                medicines.length === 0 &&
                !error && (

                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

                        <Pill
                            size={40}
                            className="mx-auto text-slate-300 mb-3"
                        />

                        <h3 className="font-semibold text-slate-700">
                            No medicines found
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                            Try searching with another medicine name.
                        </p>

                    </div>

                )}


            {/* ==========================================
                MEDICINE CARDS
            ========================================== */}

            {!loading &&
                medicines.length > 0 && (

                    <div className="grid grid-cols-3 gap-5">

                        {medicines.map((med) => (

                            <div
                                key={med.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:shadow-md transition-shadow"
                            >


                                {/* ==========================================
                                    MEDICINE HEADER
                                ========================================== */}

                                <div className="flex items-start gap-4 mb-4">

                                    <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                                        <Pill
                                            size={28}
                                            className="text-blue-400"
                                        />

                                    </div>


                                    <div className="flex-1">

                                        <h3 className="font-bold text-slate-800">
                                            {med.brand_name}
                                        </h3>


                                        <p className="text-xs text-slate-400">
                                            {med.generic_name ||
                                                "Generic name not available"}
                                        </p>


                                        {med.strength && (

                                            <p className="text-xs text-slate-400 mt-1">
                                                {med.strength}
                                            </p>

                                        )}


                                        {med.dosage_form && (

                                            <p className="text-xs text-slate-400 mt-1">
                                                {med.dosage_form}
                                            </p>

                                        )}

                                    </div>

                                </div>


                                {/* ==========================================
                                    AVAILABILITY + PRICE
                                ========================================== */}

                                <div className="flex items-center justify-between py-3 border-t border-slate-50">

                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Available at
                                        </p>

                                        <p className="text-2xl font-bold text-green-600">
                                            {med.available}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            pharmacies
                                        </p>

                                    </div>


                                    <div className="text-right">

                                        <p className="text-xs text-slate-400">
                                            Lowest Price
                                        </p>

                                        <p className="text-xl font-bold text-blue-600">

                                            {med.price > 0
                                                ? `৳${med.price.toFixed(2)}`
                                                : "N/A"
                                            }

                                        </p>

                                    </div>

                                </div>


                                {/* ==========================================
                                    PHARMACY PREVIEW
                                ========================================== */}

                                {med.pharmacies.length > 0 && (

                                    <div className="mt-3 bg-slate-50 rounded-xl p-3">

                                        <p className="text-xs font-semibold text-slate-600 mb-2">
                                            Available Pharmacies
                                        </p>


                                        <div className="space-y-2">

                                            {med.pharmacies
                                                .filter(
                                                    (ph: any) =>
                                                        Number(ph.stock) > 0
                                                )
                                                .slice(0, 2)
                                                .map(
                                                    (ph: any) => (

                                                        <div
                                                            key={`${med.id}-${ph.pharmacy_id}`}
                                                            className="flex items-center justify-between"
                                                        >

                                                            <div className="min-w-0">

                                                                <p className="text-xs font-semibold text-slate-700 truncate">
                                                                    {ph.pharmacy_name}
                                                                </p>

                                                                <p className="text-[11px] text-slate-400 truncate">
                                                                    {ph.address}
                                                                </p>

                                                            </div>


                                                            <div className="text-right ml-2 flex-shrink-0">

                                                                <p className="text-xs font-bold text-blue-600">
                                                                    ৳{ph.price.toFixed(2)}
                                                                </p>

                                                                <p className="text-[11px] text-green-600">
                                                                    {ph.stock} in stock
                                                                </p>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                        </div>

                                    </div>

                                )}


                                {/* ==========================================
                                    BUTTONS
                                ========================================== */}

                                <div className="flex gap-2 mt-4">

                                    {/* Compare */}

                                    <button
                                        onClick={() => {

                                            selectMedicine(med);

                                            setPage(
                                                "price-comparison"
                                            );

                                        }}
                                        className="flex-1 py-2 text-xs font-semibold rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        Compare Prices
                                    </button>


                                    {/* Details */}

                                    <button
                                        onClick={() => {

                                            selectMedicine(med);

                                            setPage(
                                                "medicine-details"
                                            );

                                        }}
                                        className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Details
                                    </button>


                                    {/* Reserve */}

                                    <button
                                        onClick={() => {

                                            selectMedicine(med);

                                            setPage(
                                                "medicine-details"
                                            );

                                        }}
                                        className="flex-1 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Reserve
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
}

function MedicineDetailsPage({
  setPage,
  selectedMedicine,
}: {
  setPage: (p: Page) => void;
  selectedMedicine: any;
}) {
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<any>(null);

  const [showReserveModal, setShowReserveModal] =
    useState(false);

  const [quantity, setQuantity] = useState(1);

  const [reserving, setReserving] = useState(false);

  const med = selectedMedicine;

  const medicineName =
    med?.brand_name || med?.name || "Medicine";
  const genericName =
    med?.generic_name || med?.generic || "Generic name not available";
  const strength = med?.strength || "";
  const manufacturer =
    med?.manufacturer || med?.mfr || "";
  const category = med?.category || "";

  // ==========================================
  // LOAD REAL PHARMACY AVAILABILITY
  // ==========================================

  useEffect(() => {
    if (!med) {
      setAvailability([]);
      return;
    }

    const loadAvailability = async () => {

      try {

        setLoading(true);

        const response = await api.get(
          `/medicines/availability/search?search=${encodeURIComponent(medicineName)}`
        );

        setAvailability(
          response.data.results || []
        );

      } catch (error) {

        console.error(
          "Failed to load pharmacy availability:",
          error
        );

        setAvailability([]);

      } finally {

        setLoading(false);

      }

    };

    loadAvailability();

  }, [medicineName]);


  if (!med) {
    return (
      <div className="p-6">
        <button
          onClick={() => setPage("medicine-search")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Search
        </button>

        <div className="mt-6 bg-white rounded-2xl p-8 text-center shadow-sm border border-black/5">
          <h2 className="text-lg font-bold text-slate-800">No medicine selected</h2>
          <p className="text-sm text-slate-500 mt-2">Please select a medicine from the search page.</p>
        </div>
      </div>
    );
  }

  const availablePharmacies = availability.filter(
    (ph: any) => Number(ph.stock) > 0
  );

  const positivePrices = availablePharmacies
    .map((ph: any) => Number(ph.price) || 0)
    .filter((value: number) => value > 0);

  const lowestPrice =
    positivePrices.length > 0
      ? Math.min(...positivePrices)
      : Number(med.price) || 0;



  // ==========================================
  // OPEN RESERVATION MODAL
  // ==========================================

  const openReserveModal = (pharmacy: any) => {

    setSelectedPharmacy(pharmacy);
    setQuantity(1);
    setShowReserveModal(true);

  };


  // ==========================================
  // CREATE RESERVATION
  // ==========================================

  const handleReservation = async () => {

    if (!selectedPharmacy) {
      return;
    }

    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (quantity > selectedPharmacy.stock) {
      alert(
        `Only ${selectedPharmacy.stock} units are available.`
      );
      return;
    }

    try {

      setReserving(true);

      const response = await api.post(
        "/reservations",
        {
          user_id: (() => {
            try {
              const user = JSON.parse(localStorage.getItem("user") || "{}");
              return Number(user.id || user.user_id || 1);
            } catch {
              return 1;
            }
          })(),

          pharmacy_id:
            selectedPharmacy.pharmacy_id,

          medicine_id:
            selectedPharmacy.medicine_id,

          quantity: quantity
        }
      );

      if (response.data.success) {

        alert(
          `Reservation successful!\n\nReservation ID: ${response.data.reservation_id}`
        );

        setShowReserveModal(false);

        setSelectedPharmacy(null);
        localStorage.removeItem("selectedPharmacy");

        setQuantity(1);

      } else {

        alert(
          response.data.message ||
          "Failed to create reservation."
        );

      }

    } catch (error: any) {

      console.error(
        "Reservation error:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to create reservation."
      );

    } finally {

      setReserving(false);

    }

  };


  return (
    <div className="p-6 space-y-5">

      {/* ==========================================
          BACK BUTTON
      ========================================== */}

      <button
        onClick={() => setPage("medicine-search")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Search
      </button>


      <div className="grid grid-cols-3 gap-5">

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <div className="col-span-2 space-y-5">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">

            <div className="flex items-start gap-6">

              <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                <Pill
                  size={40}
                  className="text-blue-400"
                />

              </div>


              <div className="flex-1">

                <div className="flex items-start justify-between">

                  <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                      {medicineName}
                    </h1>

                    <p className="text-slate-500">
                      {genericName}
                      {strength ? ` — ${strength}` : ""}
                    </p>

                    <p className="text-sm text-slate-400">
                      {manufacturer}
                      {manufacturer && category ? " · " : ""}
                      {category}
                    </p>
                  </div>

                  <Badge
                    label="Available"
                    variant="green"
                  />

                </div>


                <div className="mt-4 flex items-center gap-4">

                  <div className="text-center">

                    <p className="text-xs text-slate-400">
                      Lowest Price
                    </p>

                    <p className="text-2xl font-bold text-blue-600">
                      ৳{Number(lowestPrice || 0).toFixed(2)}
                    </p>

                  </div>


                  <div className="text-center">

                    <p className="text-xs text-slate-400">
                      Available At
                    </p>

                    <p className="text-2xl font-bold text-green-600">
                      {availablePharmacies.length}
                    </p>

                    <p className="text-xs text-slate-400">
                      Pharmacies
                    </p>

                  </div>

                </div>


                <div className="mt-4 flex gap-3">

                  <button
                    onClick={() =>
                      setPage("price-comparison")
                    }
                    className="px-5 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Compare Prices
                  </button>


                    <button
                        onClick={() => {

                            if (availablePharmacies.length === 0) {

                                alert(
                                    "This medicine is currently unavailable."
                                );

                                return;
                            }

                            openReserveModal(
                                availablePharmacies[0]
                            );

                        }}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Reserve Medicine
                    </button>

                </div>

              </div>

            </div>

          </div>


          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          {[
            {
              title: "Description",
              content:
                med?.description ||
                `${medicineName} information is not available yet.`
            },
            {
              title: "Uses",
              content:
                med?.uses ||
                "Uses information is not available yet."
            },
            {
              title: "Dosage",
              content:
                med?.dosage ||
                "Dosage information is not available yet."
            },
            {
              title: "Side Effects",
              content:
                med?.side_effects ||
                "Side effects information is not available yet."
            },
          ].map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"
            >
              <h3 className="font-bold text-slate-800 mb-2">
                {s.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {s.content}
              </p>
            </div>
          ))}

          </div>

        {/* ==========================================
            AVAILABLE PHARMACIES
        ========================================== */}

        <div className="space-y-5">

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

            <h3 className="font-bold text-slate-800 mb-4">
              Available Pharmacies
            </h3>


            {loading ? (

              <p className="text-sm text-slate-400">
                Loading pharmacies...
              </p>

            ) : availability.length === 0 ? (

              <p className="text-sm text-slate-400">
                No pharmacies currently have this medicine.
              </p>

            ) : (

              <div className="space-y-4">

                {availability.map(ph => (

                  <div
                    key={`${ph.pharmacy_id}-${ph.medicine_id}`}
                    className="p-3 rounded-xl bg-slate-50 space-y-2"
                  >

                    <p className="text-sm font-semibold text-slate-800">
                      {ph.pharmacy_name}
                    </p>


                    <p className="text-xs text-slate-400 flex items-center gap-1">

                      <MapPin size={10} />

                      {ph.address || "Address not available"}

                    </p>


                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-base font-bold text-blue-600">
                          ৳{Number(ph.price).toFixed(2)}
                        </p>

                        <p className="text-xs text-slate-400">
                          Stock: {ph.stock}
                        </p>

                      </div>


                      <button
                        onClick={() =>
                          openReserveModal(ph)
                        }
                        disabled={ph.stock <= 0}
                        className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        Reserve
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* WARNING */}

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">

            <p className="text-xs font-semibold text-amber-700 mb-1">
              ⚠ Important
            </p>

            <p className="text-xs text-amber-600">
              Always consult a registered physician before taking any medicine.
              Self-medication can be harmful.
            </p>

          </div>

        </div>

      </div>


      {/* ==========================================
          RESERVATION MODAL
      ========================================== */}

      {showReserveModal && selectedPharmacy && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Reserve Medicine
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Confirm your reservation
                </p>

              </div>


              <button
                onClick={() =>
                  setShowReserveModal(false)
                }
                className="text-slate-400 hover:text-slate-700 text-xl"
              >
                ×
              </button>

            </div>


            {/* Medicine */}

            <div className="bg-slate-50 rounded-xl p-4 mb-4">

              <p className="text-sm font-semibold text-slate-800">
                {selectedPharmacy.brand_name}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {selectedPharmacy.generic_name ||
                  "Generic name not available"}
              </p>

              <p className="text-xs text-slate-500">
                {selectedPharmacy.strength}
              </p>

            </div>


            {/* Pharmacy */}

            <div className="mb-4">

              <p className="text-xs text-slate-400">
                Pharmacy
              </p>

              <p className="text-sm font-semibold text-slate-800">
                {selectedPharmacy.pharmacy_name}
              </p>

              <p className="text-xs text-slate-500">
                {selectedPharmacy.address}
              </p>

            </div>


            {/* Price */}

            <div className="flex justify-between mb-4">

              <span className="text-sm text-slate-500">
                Price per unit
              </span>

              <span className="text-sm font-bold text-blue-600">
                ৳{Number(selectedPharmacy.price).toFixed(2)}
              </span>

            </div>


            {/* Stock */}

            <div className="flex justify-between mb-4">

              <span className="text-sm text-slate-500">
                Available stock
              </span>

              <span className="text-sm font-semibold text-green-600">
                {selectedPharmacy.stock}
              </span>

            </div>


            {/* Quantity */}

            <div className="mb-5">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Quantity
              </label>

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    setQuantity(
                      Math.max(1, quantity - 1)
                    )
                  }
                  className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  −
                </button>


                <input
                  type="number"
                  min="1"
                  max={selectedPharmacy.stock}
                  value={quantity}
                  onChange={e =>
                    setQuantity(
                      Math.max(
                        1,
                        Number(e.target.value)
                      )
                    )
                  }
                  className="flex-1 text-center border border-slate-200 rounded-lg h-10 outline-none"
                />


                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        selectedPharmacy.stock,
                        quantity + 1
                      )
                    )
                  }
                  className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  +
                </button>

              </div>

            </div>


            {/* Total */}

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mb-5">

              <span className="font-semibold text-slate-700">
                Total
              </span>

              <span className="text-xl font-bold text-blue-600">
                ৳
                {(
                  Number(selectedPharmacy.price) *
                  quantity
                ).toFixed(2)}
              </span>

            </div>


            {/* Buttons */}

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setShowReserveModal(false);
                  setSelectedPharmacy(null);
                }}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>


              <button
                onClick={handleReservation}
                disabled={reserving}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:bg-slate-300"
              >
                {reserving
                  ? "Reserving..."
                  : "Confirm Reservation"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function PriceComparisonPage({ setPage }: { setPage: (p: Page) => void }) {

  const [medicine, setMedicine] = useState<any>(null);
  const [pharmacies, setPharmacies] = useState<any[]>([]);


  // ==========================================
  // LOAD SELECTED MEDICINE
  // ==========================================

  useEffect(() => {

    const savedMedicine = localStorage.getItem("selectedMedicine");

    if (savedMedicine) {

      try {

        const parsedMedicine = JSON.parse(savedMedicine);

        setMedicine(parsedMedicine);

        setPharmacies(parsedMedicine.pharmacies || []);

      } catch (error) {

        console.error(
          "Failed to load selected medicine",
          error
        );

      }

    }

  }, []);


  // ==========================================
  // FIND LOWEST PRICE
  // ==========================================

  const availablePharmacies = pharmacies.filter(
    (ph: any) => Number(ph.stock) > 0
  );


  const lowestPrice =
    availablePharmacies.length > 0
      ? Math.min(
          ...availablePharmacies.map(
            (ph: any) => Number(ph.price)
          )
        )
      : 0;


  // ==========================================
  // NO MEDICINE SELECTED
  // ==========================================

  if (!medicine) {

    return (
      <div className="p-6">

        <button
          onClick={() => setPage("medicine-search")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-5"
        >
          <ArrowLeft size={16} />
          Back to Search
        </button>


        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

          <h2 className="text-lg font-bold text-slate-800">
            No medicine selected
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Please search for a medicine first.
          </p>


          <button
            onClick={() => setPage("medicine-search")}
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
          >
            Find Medicine
          </button>

        </div>

      </div>
    );

  }


  return (

    <div className="p-6 space-y-5">

      {/* BACK BUTTON */}

      <button
        onClick={() => setPage("medicine-search")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Search
      </button>


      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold text-slate-800">
          Price Comparison
        </h1>

        <p className="text-slate-500 text-sm mt-1">

          {medicine.brand_name}

          {medicine.generic_name &&
            ` — ${medicine.generic_name}`}

          {medicine.strength &&
            ` ${medicine.strength}`}

        </p>

      </div>


      {/* MEDICINE SUMMARY */}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">

            <Pill
              size={28}
              className="text-blue-500"
            />

          </div>


          <div>

            <h2 className="font-bold text-slate-800">
              {medicine.brand_name}
            </h2>

            <p className="text-sm text-slate-500">
              {medicine.generic_name ||
                "Generic name not available"}
            </p>

          </div>


          <div className="ml-auto text-right">

            <p className="text-xs text-slate-400">
              Lowest Price
            </p>

            <p className="text-2xl font-bold text-blue-600">

              {lowestPrice > 0
                ? `৳${lowestPrice.toFixed(2)}`
                : "N/A"}

            </p>

          </div>

        </div>

      </div>


      {/* PHARMACY TABLE */}

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

          <p className="font-semibold text-slate-800">

            {pharmacies.length}{" "}
            {pharmacies.length === 1
              ? "pharmacy"
              : "pharmacies"}{" "}
            found

          </p>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >

            <RefreshCw size={14} />

            Refresh

          </button>

        </div>


        {pharmacies.length === 0 ? (

          <div className="p-10 text-center">

            <Building2
              size={40}
              className="mx-auto text-slate-300 mb-3"
            />

            <h3 className="font-semibold text-slate-700">
              No pharmacies found
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              This medicine is currently not listed by any pharmacy.
            </p>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-100">

              <tr>

                {[
                  "Pharmacy",
                  "Location",
                  "Phone",
                  "Availability",
                  "Stock",
                  "Price",
                  "Actions"
                ].map((h) => (

                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-50">

              {pharmacies
                .sort(
                  (a: any, b: any) =>
                    Number(a.price) -
                    Number(b.price)
                )
                .map((ph: any, index: number) => {

                  const stock =
                    Number(ph.stock) || 0;

                  const price =
                    Number(ph.price) || 0;

                  const isAvailable =
                    stock > 0;

                  const isLowest =
                    isAvailable &&
                    price === lowestPrice;


                  return (

                    <tr
                      key={`${ph.pharmacy_id}-${index}`}
                      className={`hover:bg-slate-50/50 transition-colors ${
                        isLowest
                          ? "bg-green-50/40"
                          : ""
                      }`}
                    >

                      {/* PHARMACY */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">

                            <Building2
                              size={15}
                              className="text-green-600"
                            />

                          </div>


                          <div>

                            <p className="text-sm font-semibold text-slate-800">

                              {ph.pharmacy_name}

                            </p>


                            {isLowest && (

                              <span className="text-xs text-green-600 font-semibold">

                                Lowest Price

                              </span>

                            )}

                          </div>

                        </div>

                      </td>


                      {/* LOCATION */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-1">

                          <MapPin
                            size={12}
                            className="text-slate-400"
                          />

                          <span className="text-sm text-slate-500">

                            {ph.address ||
                              "Address not available"}

                          </span>

                        </div>

                      </td>


                      {/* PHONE */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-slate-500">

                          {ph.phone ||
                            "Not available"}

                        </span>

                      </td>


                      {/* AVAILABILITY */}

                      <td className="px-6 py-4">

                        <Badge
                          label={
                            isAvailable
                              ? "Available"
                              : "Out of Stock"
                          }
                          variant={
                            isAvailable
                              ? "green"
                              : "red"
                          }
                        />

                      </td>


                      {/* STOCK */}

                      <td className="px-6 py-4">

                        <span
                          className={`text-sm font-bold ${
                            stock === 0
                              ? "text-red-500"
                              : stock < 15
                              ? "text-amber-500"
                              : "text-slate-800"
                          }`}
                        >

                          {stock}

                        </span>

                      </td>


                      {/* PRICE */}

                      <td className="px-6 py-4">

                        {price > 0 ? (

                          <span className="text-lg font-bold text-blue-600">

                            ৳{price.toFixed(2)}

                          </span>

                        ) : (

                          <span className="text-slate-400">
                            —
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          {isAvailable && (

                            <button
                              onClick={() => {
                                localStorage.setItem(
                                  "selectedMedicine",
                                  JSON.stringify(medicine)
                                );

                                localStorage.setItem(
                                  "selectedPharmacy",
                                  JSON.stringify(ph)
                                );

                                setPage(
                                  "medicine-details"
                                );
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-semibold hover:bg-blue-700"
                            >
                              Reserve
                            </button>

                          )}


                          <button
                            onClick={() => {

                              if (
                                ph.latitude &&
                                ph.longitude
                              ) {

                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&destination=${ph.latitude},${ph.longitude}`,
                                  "_blank"
                                );

                              } else {

                                alert(
                                  "Location coordinates are not available for this pharmacy."
                                );

                              }

                            }}
                            className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs rounded-lg font-semibold hover:bg-slate-50 flex items-center gap-1"
                          >

                            <Navigation size={10} />

                            Navigate

                          </button>

                        </div>

                      </td>

                    </tr>

                  );

                })}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

}

function PharmacyLocatorPage() {

    const [selected, setSelected] = useState<number | null>(null);

    const [pharmacies, setPharmacies] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD APPROVED PHARMACIES
    // ==========================================

    const loadPharmacies = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get(
                "/pharmacies"
            );

            console.log(
                "Pharmacy response:",
                response.data
            );


            if (response.data.success) {

                setPharmacies(
                    response.data.pharmacies || []
                );

            } else {

                setPharmacies([]);

                setError(
                    response.data.message ||
                    "Failed to load pharmacies."
                );
            }

        } catch (error: any) {

            console.error(
                "Failed to load pharmacies:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to connect to the server."
            );

            setPharmacies([]);

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {

        loadPharmacies();

    }, []);


    // ==========================================
    // GET OPENING HOURS
    // ==========================================

    const getHours = (ph: any) => {

        if (
            !ph.opening_time &&
            !ph.closing_time
        ) {
            return "Hours unavailable";
        }

        if (
            ph.opening_time === "00:00:00" &&
            ph.closing_time === "23:59:59"
        ) {
            return "Open 24 Hours";
        }

        const opening = ph.opening_time
            ? String(ph.opening_time).slice(0, 5)
            : "--";

        const closing = ph.closing_time
            ? String(ph.closing_time).slice(0, 5)
            : "--";

        return `${opening} - ${closing}`;
    };


    // ==========================================
    // GET DIRECTIONS
    // ==========================================

    const getDirections = (ph: any) => {

        if (
            ph.latitude &&
            ph.longitude
        ) {

            const url =
                `https://www.google.com/maps/dir/?api=1&destination=${ph.latitude},${ph.longitude}`;

            window.open(
                url,
                "_blank"
            );

            return;
        }


        // Fallback using address

        if (ph.address) {

            const url =
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ph.address)}`;

            window.open(
                url,
                "_blank"
            );

            return;
        }


        alert(
            "Location information is not available for this pharmacy."
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="p-6">

                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-black/5">

                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

                    <p className="text-sm text-slate-500">
                        Loading pharmacies...
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="p-6 space-y-5">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div>

                <h1 className="text-2xl font-bold text-slate-800">
                    Pharmacy Locator
                </h1>

                <p className="text-slate-500 text-sm mt-1">
                    Find verified pharmacies near your location
                </p>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">

                    <p className="text-sm font-semibold text-red-700">
                        {error}
                    </p>

                    <button
                        onClick={loadPharmacies}
                        className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ==========================================
                MAIN
            ========================================== */}

            <div
                className="grid grid-cols-3 gap-5"
                style={{ height: 580 }}
            >

                {/* ==========================================
                    PHARMACY LIST
                ========================================== */}

                <div
                    className="space-y-3 overflow-y-auto pr-2"
                    style={{
                        scrollbarWidth: "thin"
                    }}
                >

                    {pharmacies.length === 0 ? (

                        <div className="bg-white rounded-2xl p-8 text-center border border-black/5">

                            <Building2
                                size={36}
                                className="mx-auto text-slate-300 mb-3"
                            />

                            <p className="text-sm font-semibold text-slate-600">
                                No approved pharmacies found
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                                Approved pharmacies will appear here.
                            </p>

                        </div>

                    ) : (

                        pharmacies.map((pharmacy) => {

                            const isSelected =
                                selected === pharmacy.id;


                            return (

                                <div
                                    key={pharmacy.id}
                                    onClick={() =>
                                        setSelected(
                                            pharmacy.id
                                        )
                                    }
                                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                                        isSelected
                                            ? "border-blue-400 bg-blue-50"
                                            : "border-black/5 bg-white hover:shadow-sm"
                                    }`}
                                >

                                    {/* Pharmacy name */}

                                    <div className="flex items-start justify-between mb-2">

                                        <h3 className="font-bold text-slate-800 text-sm">

                                            {pharmacy.pharmacy_name}

                                        </h3>


                                        <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">

                                            <CheckCircle
                                                size={11}
                                            />

                                            Verified

                                        </div>

                                    </div>


                                    {/* Address */}

                                    <p className="text-xs text-slate-400 flex items-start gap-1 mb-2">

                                        <MapPin
                                            size={11}
                                            className="flex-shrink-0 mt-0.5"
                                        />

                                        <span>
                                            {pharmacy.address ||
                                                "Address unavailable"}
                                        </span>

                                    </p>


                                    {/* Details */}

                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">

                                        <span className="flex items-center gap-1">

                                            <Clock
                                                size={10}
                                                className="text-green-400"
                                            />

                                            {getHours(pharmacy)}

                                        </span>


                                        <span className="flex items-center gap-1">

                                            <Phone
                                                size={10}
                                                className="text-slate-400"
                                            />

                                            {pharmacy.phone ||
                                                "No phone"}

                                        </span>


                                        <span className="flex items-center gap-1">

                                            <Package
                                                size={10}
                                                className="text-slate-400"
                                            />

                                            {Number(
                                                pharmacy.inventory_count || 0
                                            )} medicines

                                        </span>


                                        <span className="flex items-center gap-1">

                                            <MapPin
                                                size={10}
                                                className="text-blue-400"
                                            />

                                            {pharmacy.latitude &&
                                            pharmacy.longitude
                                                ? "Location available"
                                                : "Location unavailable"}

                                        </span>

                                    </div>


                                    {/* Directions */}

                                    <button
                                        onClick={(e) => {

                                            e.stopPropagation();

                                            getDirections(
                                                pharmacy
                                            );

                                        }}
                                        className="mt-3 w-full py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >

                                        <Navigation
                                            size={12}
                                        />

                                        Get Directions

                                    </button>

                                </div>

                            );

                        })

                    )}

                </div>


                {/* ==========================================
                    MAP AREA
                ========================================== */}

                <div className="col-span-2 bg-slate-200 rounded-2xl overflow-hidden relative">

                    <img
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&h=600&fit=crop&auto=format"
                        alt="Map view"
                        className="w-full h-full object-cover"
                    />


                    <div className="absolute inset-0 bg-blue-900/10" />


                    {/* Location label */}

                    <div className="absolute top-4 left-4 bg-white rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">

                        📍 Bangladesh

                    </div>


                    {/* Pharmacy markers */}

                    {pharmacies.map(
                        (pharmacy, index) => {

                            const left =
                                15 +
                                (index * 17) % 70;

                            const top =
                                25 +
                                (index * 23) % 50;


                            return (

                                <div
                                    key={pharmacy.id}
                                    onClick={() =>
                                        setSelected(
                                            pharmacy.id
                                        )
                                    }
                                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-lg transition-all ${
                                        selected === pharmacy.id
                                            ? "bg-blue-600 scale-125"
                                            : "bg-green-500 hover:scale-110"
                                    }`}
                                    style={{
                                        left: `${left}%`,
                                        top: `${top}%`
                                    }}
                                    title={
                                        pharmacy.pharmacy_name
                                    }
                                >

                                    {index + 1}

                                </div>

                            );

                        }
                    )}


                    {/* Selected pharmacy */}

                    {selected && (

                        <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg max-w-xs">

                            {(() => {

                                const pharmacy =
                                    pharmacies.find(
                                        (p) =>
                                            p.id === selected
                                    );


                                if (!pharmacy) {
                                    return null;
                                }


                                return (

                                    <div>

                                        <p className="text-sm font-bold text-slate-800">

                                            {pharmacy.pharmacy_name}

                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">

                                            {pharmacy.address}

                                        </p>

                                        <button
                                            onClick={() =>
                                                getDirections(
                                                    pharmacy
                                                )
                                            }
                                            className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                                        >

                                            Get Directions →

                                        </button>

                                    </div>

                                );

                            })()}

                        </div>

                    )}


                    {/* Zoom buttons */}

                    <div className="absolute bottom-4 right-4 flex flex-col gap-2">

                        <button
                            className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
                        >
                            +
                        </button>

                        <button
                            className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
                        >
                            −
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

function PharmacyDashboard({
  setPage
}: {
  setPage: (p: Page) => void;
}) {
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // ----------------------------------------
      // GET LOGGED-IN PHARMACY
      // ----------------------------------------

      const pharmacyResponse = await api.get(
        "/pharmacies/my-pharmacy"
      );

      const pharmacyData =
        pharmacyResponse.data?.pharmacy;

      if (!pharmacyData) {
        throw new Error(
          "Pharmacy information not found."
        );
      }

      setPharmacy(pharmacyData);

      const pharmacyId =
        pharmacyData.id;

      // ----------------------------------------
      // GET INVENTORY
      // ----------------------------------------

      const inventoryResponse = await api.get(
        "/inventory/my-inventory"
      );

      const inventoryData =
        inventoryResponse.data?.inventory || [];

      setInventory(inventoryData);

      // ----------------------------------------
      // GET RESERVATIONS
      // ----------------------------------------

      const reservationResponse =
        await api.get(
          `/reservations/pharmacy/${pharmacyId}`
        );

      const reservationData =
        reservationResponse.data?.reservations || [];

      setReservations(reservationData);

    } catch (error: any) {

      console.error(
        "Dashboard loading error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to load pharmacy dashboard."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);


  // ==========================================
  // INVENTORY STATISTICS
  // ==========================================

  const totalMedicines =
    inventory.length;

  const availableMedicines =
    inventory.filter(
      item => Number(item.stock) > 0
    ).length;

  const lowStockMedicines =
    inventory.filter(
      item =>
        Number(item.stock) > 0 &&
        Number(item.stock) < 15
    );

  const outOfStockMedicines =
    inventory.filter(
      item =>
        Number(item.stock) === 0
    );


  // ==========================================
  // RESERVATION STATISTICS
  // ==========================================

  const today = new Date();

  const todayReservations =
    reservations.filter((r) => {

      if (!r.created_at) {
        return false;
      }

      const reservationDate =
        new Date(r.created_at);

      return (
        reservationDate.toDateString() ===
        today.toDateString()
      );
    });


  const pendingReservations =
    reservations.filter(
      r =>
        String(r.status).toLowerCase() ===
        "pending"
    );


  // ==========================================
  // RECENT RESERVATIONS
  // ==========================================

  const recentReservations =
    [...reservations]
      .sort(
        (a, b) =>
          new Date(
            b.created_at || 0
          ).getTime() -
          new Date(
            a.created_at || 0
          ).getTime()
      )
      .slice(0, 4);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-6">

        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Loading pharmacy dashboard...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="p-6 space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Pharmacy Dashboard
          </h1>

          <p className="text-slate-500 text-sm mt-1">

            {pharmacy?.pharmacy_name ||
              "Your Pharmacy"}

            {" · "}

            {pharmacy?.address ||
              "Address not available"}

          </p>

        </div>


        <div className="flex items-center gap-3">

          {/* STATUS */}

          <span
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${
              String(
                pharmacy?.status
              ).toLowerCase() === "approved"
                ? "text-green-600 bg-green-50"
                : "text-amber-600 bg-amber-50"
            }`}
          >

            <span
              className={`w-1.5 h-1.5 rounded-full ${
                String(
                  pharmacy?.status
                ).toLowerCase() === "approved"
                  ? "bg-green-500"
                  : "bg-amber-500"
              }`}
            />

            {pharmacy?.status || "Pending"}

          </span>


          {/* ADD MEDICINE */}

          <button
            onClick={() =>
              setPage("pharmacy-inventory")
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Medicine
          </button>

        </div>

      </div>


      {/* ========================================
          STAT CARDS
      ======================================== */}

      <div className="grid grid-cols-4 gap-5">

        <StatCard
          icon={Package}
          label="Total Medicines"
          value={String(totalMedicines)}
          sub="in inventory"
          color="bg-blue-500"
        />

        <StatCard
          icon={CheckCircle}
          label="Available"
          value={String(availableMedicines)}
          sub="currently in stock"
          color="bg-green-500"
        />

        <StatCard
          icon={ShoppingBag}
          label="Today's Reservations"
          value={String(
            todayReservations.length
          )}
          sub={`${pendingReservations.length} pending`}
          color="bg-amber-500"
        />

        <StatCard
          icon={Users}
          label="Customers"
          value={String(
            new Set(
              reservations
                .map(r => r.user_id)
                .filter(Boolean)
            ).size
          )}
          sub="from reservations"
          color="bg-purple-500"
        />

      </div>


      {/* ========================================
          LOW STOCK ALERT
      ======================================== */}

      {lowStockMedicines.length > 0 && (

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">

          <AlertTriangle
            size={18}
            className="text-amber-500 flex-shrink-0 mt-0.5"
          />

          <div>

            <p className="text-sm font-semibold text-amber-800">
              Low Stock Alert
            </p>

            <p className="text-xs text-amber-600 mt-1">

              {lowStockMedicines
                .slice(0, 4)
                .map(
                  item =>
                    `${item.brand_name || "Medicine"} (${item.stock} units)`
                )
                .join(", ")}

              {lowStockMedicines.length > 4
                ? " and more"
                : ""}

              {" "}are running low.

            </p>

          </div>


          <button
            onClick={() =>
              setPage("pharmacy-inventory")
            }
            className="ml-auto text-xs font-semibold text-amber-700 hover:underline whitespace-nowrap"
          >
            Update Stock
          </button>

        </div>

      )}


      {/* ========================================
          OUT OF STOCK ALERT
      ======================================== */}

      {outOfStockMedicines.length > 0 && (

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">

          <XCircle
            size={18}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />

          <div>

            <p className="text-sm font-semibold text-red-800">
              Out of Stock
            </p>

            <p className="text-xs text-red-600 mt-1">

              {outOfStockMedicines
                .slice(0, 4)
                .map(
                  item =>
                    item.brand_name ||
                    "Medicine"
                )
                .join(", ")}

              {outOfStockMedicines.length > 4
                ? " and more"
                : ""}

            </p>

          </div>

        </div>

      )}


      {/* ========================================
          RESERVATIONS + INVENTORY
      ======================================== */}

      <div className="grid grid-cols-2 gap-5">


        {/* ======================================
            RECENT RESERVATIONS
        ====================================== */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-bold text-slate-800">
              Recent Reservations
            </h3>

            <button
              onClick={() =>
                setPage(
                  "pharmacy-reservations"
                )
              }
              className="text-xs text-blue-600 hover:underline"
            >
              View All
            </button>

          </div>


          {recentReservations.length === 0 ? (

            <div className="text-center py-8">

              <ShoppingBag
                size={32}
                className="mx-auto text-slate-300 mb-2"
              />

              <p className="text-sm text-slate-400">
                No reservations yet
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {recentReservations.map(
                reservation => (

                  <div
                    key={reservation.id}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >

                    <div>

                      <p className="text-sm font-semibold text-slate-800">

                        {reservation.full_name ||
                          reservation.email ||
                          `User ${reservation.user_id}`}

                      </p>

                      <p className="text-xs text-slate-400">

                        {reservation.brand_name ||
                          "Medicine"}

                        {" × "}

                        {reservation.quantity}

                      </p>

                    </div>


                    <Badge
                      label={
                        String(
                          reservation.status ||
                          "pending"
                        )
                          .charAt(0)
                          .toUpperCase() +
                        String(
                          reservation.status ||
                          "pending"
                        ).slice(1)
                      }
                      variant={
                        String(
                          reservation.status
                        ).toLowerCase() ===
                        "pending"
                          ? "yellow"
                          : String(
                              reservation.status
                            ).toLowerCase() ===
                            "approved"
                            ? "blue"
                            : String(
                                reservation.status
                              ).toLowerCase() ===
                              "completed"
                              ? "green"
                              : "red"
                      }
                    />

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* ======================================
            INVENTORY OVERVIEW
        ====================================== */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-bold text-slate-800">
              Inventory Overview
            </h3>

            <button
              onClick={() =>
                setPage(
                  "pharmacy-inventory"
                )
              }
              className="text-xs text-blue-600 hover:underline"
            >
              Manage Inventory
            </button>

          </div>


          {inventory.length === 0 ? (

            <div className="text-center py-8">

              <Package
                size={32}
                className="mx-auto text-slate-300 mb-2"
              />

              <p className="text-sm text-slate-400">
                No medicines in inventory
              </p>

              <button
                onClick={() =>
                  setPage(
                    "pharmacy-inventory"
                  )
                }
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Add your first medicine
              </button>

            </div>

          ) : (

            <div className="space-y-3">

              {inventory
                .slice(0, 5)
                .map(item => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >

                    <div>

                      <p className="text-sm font-semibold text-slate-800">
                        {item.brand_name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {item.generic_name || ""}
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="text-sm font-semibold text-slate-700">
                        {item.stock} units
                      </p>

                      <p className="text-xs text-blue-600">
                        ৳
                        {Number(
                          item.price || 0
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>


      {/* ========================================
          REFRESH
      ======================================== */}

      <div className="flex justify-end">

        <button
          onClick={loadDashboard}
          className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Refresh Dashboard
        </button>

      </div>

    </div>
  );
}
function PharmacyInventory() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const [inventory, setInventory] = useState<any[]>([]);
    const [medicines, setMedicines] = useState<any[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const [form, setForm] = useState({
        medicine_id: "",
        stock: "",
        price: ""
    });

    // ==========================================
    // LOAD LOGGED-IN PHARMACY INVENTORY
    // ==========================================

    const loadInventory = async () => {
        try {
            const response = await api.get("/inventory/my-inventory");

            console.log("Inventory response:", response.data);

            if (response.data.success) {
                setInventory(response.data.inventory || []);
            } else {
                setInventory([]);
            }

        } catch (error: any) {

            console.error(
                "Failed to load inventory:",
                error.response?.data || error
            );

            setInventory([]);
        }
    };


    // ==========================================
    // LOAD MEDICINES
    // ==========================================

    const loadMedicines = async () => {
        try {

            const response = await api.get("/medicines");

            console.log("Medicines response:", response.data);

            if (Array.isArray(response.data)) {

                setMedicines(response.data);

            } else if (Array.isArray(response.data.medicines)) {

                setMedicines(response.data.medicines);

            } else {

                setMedicines([]);
            }

        } catch (error: any) {

            console.error(
                "Failed to load medicines:",
                error.response?.data || error
            );

            setMedicines([]);
        }
    };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        loadInventory();
        loadMedicines();

    }, []);


    // ==========================================
    // FILTER INVENTORY
    // ==========================================

    const filtered = inventory.filter((item) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            String(item.brand_name || "")
                .toLowerCase()
                .includes(searchText) ||

            String(item.generic_name || "")
                .toLowerCase()
                .includes(searchText);


        const stock = Number(item.stock || 0);

        const matchesStatus =
            statusFilter === "All Status" ||

            (
                statusFilter === "Available" &&
                stock >= 15
            ) ||

            (
                statusFilter === "Low Stock" &&
                stock > 0 &&
                stock < 15
            ) ||

            (
                statusFilter === "Out of Stock" &&
                stock === 0
            );


        return matchesSearch && matchesStatus;
    });


    // ==========================================
    // OPEN ADD MODAL
    // ==========================================

    const openAddModal = () => {

        setEditingItem(null);

        setForm({
            medicine_id: "",
            stock: "",
            price: ""
        });

        setShowModal(true);
    };


    // ==========================================
    // OPEN EDIT MODAL
    // ==========================================

    const openEditModal = (item: any) => {

        setEditingItem(item);

        setForm({
            medicine_id: String(item.medicine_id),
            stock: String(item.stock),
            price: String(item.price)
        });

        setShowModal(true);
    };


    // ==========================================
    // SAVE INVENTORY
    // ==========================================

    const saveInventory = async () => {

        if (!form.medicine_id) {

            alert("Please select a medicine.");

            return;
        }


        if (
            form.stock === "" ||
            form.price === ""
        ) {

            alert("Please enter stock and price.");

            return;
        }


        const stock = Number(form.stock);
        const price = Number(form.price);


        if (stock < 0) {

            alert("Stock cannot be negative.");

            return;
        }


        if (price < 0) {

            alert("Price cannot be negative.");

            return;
        }


        try {

            if (editingItem) {

                // ==========================================
                // UPDATE EXISTING INVENTORY
                // ==========================================

                await api.put(
                    `/inventory/${editingItem.id}`,
                    {
                        stock,
                        price
                    }
                );

                alert("Inventory updated successfully.");

            } else {

                // ==========================================
                // ADD NEW INVENTORY
                // ==========================================

                await api.post(
                    "/inventory",
                    {
                        medicine_id: Number(form.medicine_id),
                        stock,
                        price
                    }
                );

                alert("Medicine added to inventory.");
            }


            // Close modal
            setShowModal(false);

            setEditingItem(null);

            setForm({
                medicine_id: "",
                stock: "",
                price: ""
            });


            // Reload inventory from database
            await loadInventory();

        } catch (error: any) {

            console.error(
                "Inventory save error:",
                error.response?.data || error
            );


            const message =
                error.response?.data?.message ||
                "Failed to save inventory.";


            alert(message);
        }
    };


    // ==========================================
    // DELETE INVENTORY
    // ==========================================

    const deleteInventory = async (id: number) => {

        const confirmed = window.confirm(
            "Are you sure you want to remove this medicine from inventory?"
        );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/inventory/${id}`
            );

            alert("Medicine removed from inventory.");

            await loadInventory();

        } catch (error: any) {

            console.error(
                "Delete inventory error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete inventory."
            );
        }
    };


    return (
        <div className="p-6 space-y-5">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Medicine Inventory
                    </h1>

                    <p className="text-slate-500 text-sm mt-1">
                        Manage your pharmacy stock
                    </p>

                </div>


                <div className="flex gap-3">

                    <button
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                    >
                        <Download size={16} />
                        Export
                    </button>


                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Add Medicine
                    </button>

                </div>

            </div>


            {/* ==========================================
                SEARCH + FILTER
            ========================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4">

                    <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 focus-within:border-blue-400 transition-all">

                        <Search
                            size={16}
                            className="text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="flex-1 outline-none text-sm text-slate-700"
                            placeholder="Search medicine..."
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                    >

                        <option>All Status</option>
                        <option>Available</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>

                    </select>

                </div>


                {/* ==========================================
                    TABLE
                ========================================== */}

                <table className="w-full">

                    <thead className="bg-slate-50 border-b border-slate-100">

                        <tr>

                            {[
                                "Medicine",
                                "Generic Name",
                                "Current Stock",
                                "Selling Price",
                                "Status",
                                "Actions"
                            ].map((h) => (

                                <th
                                    key={h}
                                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                                >
                                    {h}
                                </th>

                            ))}

                        </tr>

                    </thead>


                    <tbody className="divide-y divide-slate-50">

                        {filtered.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-sm text-slate-400"
                                >
                                    {inventory.length === 0
                                        ? "No inventory items found."
                                        : "No medicines match your search or filter."
                                    }
                                </td>

                            </tr>

                        ) : (

                            filtered.map((item) => {

                                const stock = Number(item.stock || 0);

                                return (

                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >

                                        {/* Medicine */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">

                                                    <Pill
                                                        size={14}
                                                        className="text-blue-400"
                                                    />

                                                </div>

                                                <p className="text-sm font-semibold text-slate-800">
                                                    {item.brand_name || "Unknown Medicine"}
                                                </p>

                                            </div>

                                        </td>


                                        {/* Generic */}

                                        <td className="px-6 py-4 text-sm text-slate-500">

                                            {item.generic_name || "—"}

                                        </td>


                                        {/* Stock */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`text-sm font-bold ${
                                                    stock === 0
                                                        ? "text-red-500"
                                                        : stock < 15
                                                        ? "text-amber-500"
                                                        : "text-slate-800"
                                                }`}
                                            >
                                                {stock}
                                            </span>

                                        </td>


                                        {/* Price */}

                                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">

                                            ৳{Number(item.price || 0).toFixed(2)}

                                        </td>


                                        {/* Status */}

                                        <td className="px-6 py-4">

                                            <Badge
                                                label={
                                                    stock === 0
                                                        ? "Out of Stock"
                                                        : stock < 15
                                                        ? "Low Stock"
                                                        : "Available"
                                                }
                                                variant={
                                                    stock === 0
                                                        ? "red"
                                                        : stock < 15
                                                        ? "yellow"
                                                        : "green"
                                                }
                                            />

                                        </td>


                                        {/* Actions */}

                                        <td className="px-6 py-4">

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        openEditModal(item)
                                                    }
                                                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={14} />
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        openEditModal(item)
                                                    }
                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                >
                                                    Update Stock
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        deleteInventory(item.id)
                                                    }
                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );

                            })

                        )}

                    </tbody>

                </table>

            </div>


            {/* ==========================================
                ADD / EDIT MODAL
            ========================================== */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

                        <div className="flex items-center justify-between mb-5">

                            <div>

                                <h2 className="text-lg font-bold text-slate-800">

                                    {editingItem
                                        ? "Edit Inventory"
                                        : "Add Medicine to Inventory"
                                    }

                                </h2>

                                <p className="text-xs text-slate-400 mt-1">

                                    {editingItem
                                        ? "Update stock and selling price"
                                        : "Add a medicine to your pharmacy"
                                    }

                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="text-slate-400 hover:text-slate-700 text-xl"
                            >
                                ×
                            </button>

                        </div>


                        {/* Medicine */}

                        <div className="mb-4">

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Medicine
                            </label>

                            <select
                                value={form.medicine_id}
                                disabled={!!editingItem}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        medicine_id: e.target.value
                                    })
                                }
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 disabled:bg-slate-100"
                            >

                                <option value="">
                                    Select Medicine
                                </option>

                                {medicines.map((medicine) => (

                                    <option
                                        key={medicine.id}
                                        value={medicine.id}
                                    >
                                        {medicine.brand_name}
                                        {medicine.generic_name
                                            ? ` - ${medicine.generic_name}`
                                            : ""
                                        }
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Stock */}

                        <div className="mb-4">

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Stock
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={form.stock}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        stock: e.target.value
                                    })
                                }
                                placeholder="Enter stock quantity"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                            />

                        </div>


                        {/* Price */}

                        <div className="mb-6">

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Selling Price (৳)
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        price: e.target.value
                                    })
                                }
                                placeholder="Enter selling price"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                            />

                        </div>


                        {/* Buttons */}

                        <div className="flex gap-3">

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>


                            <button
                                onClick={saveInventory}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                            >
                                {editingItem
                                    ? "Save Changes"
                                    : "Add Medicine"
                                }
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}
function MyReservationsPage({
  setPage
}: {
  setPage: (p: Page) => void;
}) {

  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getCurrentUser = () => {

    try {

      const savedUser =
        localStorage.getItem("user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);

    } catch (error) {

      console.error(
        "Failed to read logged-in user:",
        error
      );

      return null;
    }
  };


  // ==========================================
  // LOAD RESERVATIONS
  // ==========================================

  const loadReservations = async () => {

    try {

      setLoading(true);
      setError("");


      const user = getCurrentUser();


      // No logged-in user

      if (!user || !user.id) {

        setReservations([]);

        setError(
          "Please login to view your reservations."
        );

        return;
      }


      console.log(
        "Loading reservations for user:",
        user.id
      );


      const response = await api.get(
        `/reservations/user/${user.id}`
      );


      console.log(
        "Reservation response:",
        response.data
      );


      if (response.data.success) {

        setReservations(
          response.data.reservations || []
        );

      } else {

        setReservations([]);

        setError(
          response.data.message ||
          "Failed to load reservations."
        );

      }

    } catch (error: any) {

      console.error(
        "Failed to load reservations:",
        error.response?.data || error
      );


      setReservations([]);


      setError(
        error.response?.data?.message ||
        "Failed to load reservations."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    loadReservations();

  }, []);


  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (
    status: string
  ) => {

    switch (
      String(status).toLowerCase()
    ) {

      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "approved":
        return "bg-green-50 text-green-700";

      case "completed":
        return "bg-blue-50 text-blue-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      case "rejected":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-50 text-slate-600";
    }

  };


  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {

    loadReservations();

  };


  return (

    <div className="p-6 space-y-5">


      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            My Reservations
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            View and manage your medicine reservations
          </p>

        </div>


        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >

          <RefreshCw size={15} />

          Refresh

        </button>

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">

          <p className="text-sm font-semibold text-red-700">
            {error}
          </p>

          {!getCurrentUser() && (

            <button
              onClick={() => setPage("login")}
              className="mt-2 text-xs font-semibold text-red-600 hover:underline"
            >
              Login now
            </button>

          )}

        </div>

      )}


      {/* ==========================================
          LOADING
      ========================================== */}

      {loading && (

        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Loading your reservations...
          </p>

        </div>

      )}


      {/* ==========================================
          EMPTY
      ========================================== */}

      {!loading &&
        !error &&
        reservations.length === 0 && (

          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

            <ShoppingBag
              size={42}
              className="mx-auto text-slate-300 mb-4"
            />

            <h3 className="font-semibold text-slate-700">
              No reservations yet
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Your medicine reservations will appear here.
            </p>

            <button
              onClick={() =>
                setPage("medicine-search")
              }
              className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
            >
              Find Medicine
            </button>

          </div>

        )}


      {/* ==========================================
          RESERVATIONS
      ========================================== */}

      {!loading &&
        reservations.length > 0 && (

          <div className="space-y-4">

            {reservations.map(
              (reservation) => (

                <div
                  key={reservation.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"
                >


                  {/* ==========================================
                      TOP
                  ========================================== */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                        <Pill
                          size={24}
                          className="text-blue-500"
                        />

                      </div>


                      <div>

                        <h3 className="font-bold text-slate-800">

                          {reservation.brand_name ||
                            "Medicine"}

                        </h3>


                        <p className="text-sm text-slate-500">

                          {reservation.generic_name ||
                            "Generic name not available"}

                        </p>


                        {reservation.strength && (

                          <p className="text-xs text-slate-400 mt-1">

                            {reservation.strength}

                          </p>

                        )}

                      </div>

                    </div>


                    {/* STATUS */}

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                        reservation.status
                      )}`}
                    >

                      {reservation.status ||
                        "pending"}

                    </span>

                  </div>


                  {/* ==========================================
                      DETAILS
                  ========================================== */}

                  <div className="grid grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">


                    {/* Pharmacy */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Pharmacy
                      </p>

                      <p className="text-sm font-semibold text-slate-700 mt-1">

                        {reservation.pharmacy_name ||
                          "Unknown Pharmacy"}

                      </p>

                    </div>


                    {/* Quantity */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Quantity
                      </p>

                      <p className="text-sm font-semibold text-slate-700 mt-1">

                        {reservation.quantity}

                      </p>

                    </div>


                    {/* Price */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Price
                      </p>

                      <p className="text-sm font-semibold text-blue-600 mt-1">

                        ৳
                        {Number(
                          reservation.price || 0
                        ).toFixed(2)}

                      </p>

                    </div>


                    {/* Reservation ID */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Reservation ID
                      </p>

                      <p className="text-sm font-semibold text-slate-700 mt-1">

                        #{reservation.id}

                      </p>

                    </div>

                  </div>


                  {/* ==========================================
                      ADDRESS
                  ========================================== */}

                  {reservation.address && (

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl">

                      <div className="flex items-start gap-2">

                        <MapPin
                          size={14}
                          className="text-blue-500 mt-0.5"
                        />

                        <div>

                          <p className="text-xs text-slate-400">
                            Pharmacy Address
                          </p>

                          <p className="text-sm text-slate-600 mt-0.5">
                            {reservation.address}
                          </p>

                        </div>

                      </div>

                    </div>

                  )}


                  {/* ==========================================
                      DATE
                  ========================================== */}

                  {reservation.created_at && (

                    <p className="text-xs text-slate-400 mt-4">

                      Reserved on{" "}

                      {new Date(
                        reservation.created_at
                      ).toLocaleString()}

                    </p>

                  )}

                </div>

              )
            )}

          </div>

        )}

    </div>

  );

}

function PharmacyProfile() {
    const [pharmacy, setPharmacy] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        pharmacy_name: "",
        owner_name: "",
        phone: "",
        email: "",
        address: "",
        opening_time: "",
        closing_time: ""
    });


    // ==========================================
    // LOAD MY PHARMACY
    // ==========================================

    const loadPharmacy = async () => {
        try {

            setLoading(true);

            const response = await api.get(
                "/pharmacies/my-pharmacy"
            );

            console.log(
                "My pharmacy:",
                response.data
            );

            if (response.data.success) {

                const data = response.data.pharmacy;

                setPharmacy(data);

                setForm({
                    pharmacy_name: data.pharmacy_name || "",
                    owner_name: data.owner_name || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    address: data.address || "",
                    opening_time: data.opening_time || "",
                    closing_time: data.closing_time || ""
                });
            }

        } catch (error: any) {

            console.error(
                "Failed to load pharmacy:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load pharmacy profile."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {

        loadPharmacy();

    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSave = async () => {

        if (!pharmacy?.id) {

            alert("Pharmacy information not found.");

            return;
        }


        if (!form.pharmacy_name.trim()) {

            alert("Pharmacy name is required.");

            return;
        }


        if (!form.address.trim()) {

            alert("Address is required.");

            return;
        }


        try {

            setSaving(true);

            const response = await api.put(
                `/pharmacies/${pharmacy.id}`,
                {
                    pharmacy_name: form.pharmacy_name,
                    owner_name: form.owner_name,
                    phone: form.phone,
                    email: form.email,
                    address: form.address,
                    opening_time: form.opening_time || null,
                    closing_time: form.closing_time || null
                }
            );


            if (response.data.success) {

                alert(
                    "Pharmacy profile updated successfully."
                );

                await loadPharmacy();

            } else {

                alert(
                    response.data.message ||
                    "Failed to update profile."
                );
            }

        } catch (error: any) {

            console.error(
                "Update pharmacy error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update pharmacy profile."
            );

        } finally {

            setSaving(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="p-6">

                <div className="bg-white rounded-2xl p-10 shadow-sm border border-black/5 text-center">

                    <p className="text-sm text-slate-500">
                        Loading pharmacy profile...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // NO PHARMACY
    // ==========================================

    if (!pharmacy) {

        return (
            <div className="p-6">

                <div className="bg-white rounded-2xl p-10 shadow-sm border border-black/5 text-center">

                    <Building2
                        size={40}
                        className="mx-auto text-slate-300 mb-3"
                    />

                    <h2 className="font-bold text-slate-700">
                        Pharmacy Not Found
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                        No pharmacy profile is linked to this account.
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="p-6 space-y-5 max-w-3xl">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div>

                <h1 className="text-2xl font-bold text-slate-800">
                    Pharmacy Profile
                </h1>

                <p className="text-slate-500 text-sm mt-1">
                    Manage your pharmacy information
                </p>

            </div>


            {/* ==========================================
                PROFILE CARD
            ========================================== */}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">

                {/* Pharmacy Header */}

                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">

                    <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

                        <Building2
                            size={28}
                            className="text-green-600"
                        />

                    </div>


                    <div className="flex-1">

                        <h2 className="text-xl font-bold text-slate-800">
                            {pharmacy.pharmacy_name}
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            {pharmacy.email || "No email provided"}
                        </p>


                        <div className="mt-2">

                            <Badge
                                label={
                                    pharmacy.status === "approved"
                                        ? "Verified"
                                        : pharmacy.status === "pending"
                                        ? "Pending Approval"
                                        : pharmacy.status === "rejected"
                                        ? "Rejected"
                                        : pharmacy.status
                                }
                                variant={
                                    pharmacy.status === "approved"
                                        ? "green"
                                        : pharmacy.status === "pending"
                                        ? "yellow"
                                        : pharmacy.status === "rejected"
                                        ? "red"
                                        : "blue"
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    FORM
                ========================================== */}

                <div className="grid grid-cols-2 gap-5">

                    {/* Pharmacy Name */}

                    <div className="col-span-2">

                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Pharmacy Name
                        </label>

                        <input
                            name="pharmacy_name"
                            value={form.pharmacy_name}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    {/* Owner */}

                    <div>

                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Owner Name
                        </label>

                        <input
                            name="owner_name"
                            value={form.owner_name}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    {/* Phone */}

                    <div>

                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Phone Number
                        </label>

                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    {/* Email */}

                    <div className="col-span-2">

                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    {/* Address */}

                    <div className="col-span-2">

                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Full Address
                        </label>

                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    {/* Opening Time */}

                    <div>

                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Opening Time
                        </label>

                        <input
                            type="time"
                            name="opening_time"
                            value={form.opening_time}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    {/* Closing Time */}

                    <div>

                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Closing Time
                        </label>

                        <input
                            type="time"
                            name="closing_time"
                            value={form.closing_time}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>


                {/* ==========================================
                    SAVE BUTTON
                ========================================== */}

                <div className="mt-6 flex justify-end">

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        {saving
                            ? "Saving..."
                            : "Save Changes"
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}

function AdminDashboard({
  setPage
}: {
  setPage: (p: Page) => void;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    approvedPharmacies: 0,
    pendingPharmacies: 0,
    rejectedPharmacies: 0,
    totalMedicines: 0,
    totalReservations: 0,
    todayReservations: 0,
    pendingReservations: 0,
    pendingPharmacyList: [] as any[]
  });

  // ==========================================
  // LOAD ADMIN DASHBOARD DATA
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/dashboard");

      console.log(
        "Admin Dashboard Response:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
          "Failed to load dashboard"
        );
      }

      const stats = response.data.stats || {};

      const pendingPharmacies =
        response.data.pendingPharmacies || [];

      // ==========================================
      // USERS
      // ==========================================

      setUsers(
        Array.from({
          length: Number(stats.totalUsers || 0)
        })
      );

      // ==========================================
      // PHARMACIES
      // ==========================================

      setPharmacies([
        ...Array.from({
          length: Number(stats.approvedPharmacies || 0)
        }).map(() => ({
          status: "approved"
        })),

        ...Array.from({
          length: Number(stats.pendingPharmacies || 0)
        }).map(() => ({
          status: "pending"
        })),

        ...Array.from({
          length: Number(stats.rejectedPharmacies || 0)
        }).map(() => ({
          status: "rejected"
        }))
      ]);

      // ==========================================
      // MEDICINES
      // ==========================================

      setMedicines(
        Array.from({
          length: Number(stats.totalMedicines || 0)
        })
      );

      // ==========================================
      // RESERVATIONS
      // ==========================================

      setReservations(
        Array.from({
          length: Number(stats.totalReservations || 0)
        }).map(() => ({
          status: "completed"
        }))
      );

      // ==========================================
      // SAVE DASHBOARD STATS
      // ==========================================

      setDashboardStats({
        totalUsers: Number(stats.totalUsers || 0),

        totalPharmacies:
          Number(stats.totalPharmacies || 0),

        approvedPharmacies:
          Number(stats.approvedPharmacies || 0),

        pendingPharmacies:
          Number(stats.pendingPharmacies || 0),

        rejectedPharmacies:
          Number(stats.rejectedPharmacies || 0),

        totalMedicines:
          Number(stats.totalMedicines || 0),

        totalReservations:
          Number(stats.totalReservations || 0),

        todayReservations:
          Number(stats.todayReservations || 0),

        pendingReservations:
          Number(stats.pendingReservations || 0),

        pendingPharmacyList:
          pendingPharmacies
      });

    } catch (error: any) {

      console.error(
        "Admin dashboard loading error:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to load admin dashboard"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================
  // STATISTICS
  // IMPORTANT:
  // DO NOT DECLARE THESE AGAIN BELOW
  // ==========================================

  const totalUsers =
    dashboardStats.totalUsers;

  const totalPharmacies =
    dashboardStats.totalPharmacies;

  const approvedPharmacies =
    dashboardStats.approvedPharmacies;

  const pendingPharmacies =
    dashboardStats.pendingPharmacies;

  const rejectedPharmacies =
    dashboardStats.rejectedPharmacies;

  const totalMedicines =
    dashboardStats.totalMedicines;

  const totalReservations =
    dashboardStats.totalReservations;

  const todayReservations =
    dashboardStats.todayReservations;

  const pendingReservations =
    dashboardStats.pendingReservations;

  const pendingPharmacyList =
    dashboardStats.pendingPharmacyList;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Loading admin dashboard...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="p-6 space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Admin Dashboard
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            MediFind BD System Overview ·{" "}
            {new Date().toLocaleDateString()}
          </p>

        </div>

        <button
          onClick={loadDashboard}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Refresh
        </button>

      </div>

      {/* ========================================
          STAT CARDS
      ======================================== */}

      <div className="grid grid-cols-4 gap-5">

        <StatCard
          icon={Users}
          label="Total Users"
          value={String(totalUsers)}
          sub="registered users"
          color="bg-blue-500"
        />

        <StatCard
          icon={Building2}
          label="Pharmacies"
          value={String(approvedPharmacies)}
          sub={`${pendingPharmacies} pending approval`}
          color="bg-green-500"
        />

        <StatCard
          icon={Pill}
          label="Medicines"
          value={String(totalMedicines)}
          sub="in master list"
          color="bg-amber-500"
        />

        <StatCard
          icon={ShoppingBag}
          label="Reservations"
          value={String(totalReservations)}
          sub={`${todayReservations} today`}
          color="bg-purple-500"
        />

      </div>

      {/* ========================================
          QUICK STATISTICS
      ======================================== */}

      <div className="grid grid-cols-3 gap-5">

        {/* APPROVED */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">

              <CheckCircle
                size={20}
                className="text-green-600"
              />

            </div>

            <div>

              <p className="text-xs text-slate-400">
                Approved Pharmacies
              </p>

              <p className="text-xl font-bold text-slate-800">
                {approvedPharmacies}
              </p>

            </div>

          </div>

        </div>

        {/* PENDING */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">

              <AlertTriangle
                size={20}
                className="text-amber-600"
              />

            </div>

            <div>

              <p className="text-xs text-slate-400">
                Pending Pharmacies
              </p>

              <p className="text-xl font-bold text-slate-800">
                {pendingPharmacies}
              </p>

            </div>

          </div>

        </div>

        {/* RESERVATIONS */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">

              <ShoppingBag
                size={20}
                className="text-purple-600"
              />

            </div>

            <div>

              <p className="text-xs text-slate-400">
                Pending Reservations
              </p>

              <p className="text-xl font-bold text-slate-800">
                {pendingReservations}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================
          PHARMACY STATUS
      ======================================== */}

      <div className="grid grid-cols-2 gap-5">

        {/* PHARMACY STATUS */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

          <div className="flex items-center justify-between mb-5">

            <h3 className="font-bold text-slate-800">
              Pharmacy Status
            </h3>

            <button
              onClick={() =>
                setPage(
                  "admin-pharmacy-approval"
                )
              }
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Manage
            </button>

          </div>

          <div className="space-y-4">

            {/* APPROVED */}

            <div>

              <div className="flex justify-between text-sm mb-1">

                <span className="text-slate-600">
                  Approved
                </span>

                <span className="font-semibold text-green-600">
                  {approvedPharmacies}
                </span>

              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width:
                      totalPharmacies > 0
                        ? `${(
                            approvedPharmacies /
                            totalPharmacies
                          ) * 100}%`
                        : "0%"
                  }}
                />

              </div>

            </div>

            {/* PENDING */}

            <div>

              <div className="flex justify-between text-sm mb-1">

                <span className="text-slate-600">
                  Pending
                </span>

                <span className="font-semibold text-amber-600">
                  {pendingPharmacies}
                </span>

              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width:
                      totalPharmacies > 0
                        ? `${(
                            pendingPharmacies /
                            totalPharmacies
                          ) * 100}%`
                        : "0%"
                  }}
                />

              </div>

            </div>

            {/* REJECTED */}

            <div>

              <div className="flex justify-between text-sm mb-1">

                <span className="text-slate-600">
                  Rejected
                </span>

                <span className="font-semibold text-red-600">
                  {rejectedPharmacies}
                </span>

              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{
                    width:
                      totalPharmacies > 0
                        ? `${(
                            rejectedPharmacies /
                            totalPharmacies
                          ) * 100}%`
                        : "0%"
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* PLATFORM SUMMARY */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

          <h3 className="font-bold text-slate-800 mb-5">
            Platform Summary
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 bg-blue-50 rounded-xl">

              <p className="text-xs text-blue-500">
                Users
              </p>

              <p className="text-2xl font-bold text-blue-700 mt-1">
                {totalUsers}
              </p>

            </div>

            <div className="p-4 bg-amber-50 rounded-xl">

              <p className="text-xs text-amber-500">
                Medicines
              </p>

              <p className="text-2xl font-bold text-amber-700 mt-1">
                {totalMedicines}
              </p>

            </div>

            <div className="p-4 bg-green-50 rounded-xl">

              <p className="text-xs text-green-500">
                Pharmacies
              </p>

              <p className="text-2xl font-bold text-green-700 mt-1">
                {approvedPharmacies}
              </p>

            </div>

            <div className="p-4 bg-purple-50 rounded-xl">

              <p className="text-xs text-purple-500">
                Reservations
              </p>

              <p className="text-2xl font-bold text-purple-700 mt-1">
                {totalReservations}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================
          PENDING PHARMACY APPROVALS
      ======================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

          <div>

            <h3 className="font-bold text-slate-800">
              Pending Pharmacy Approvals
            </h3>

            <p className="text-xs text-slate-400 mt-1">

              {pendingPharmacies} pharmacy
              {pendingPharmacies !== 1
                ? "s"
                : ""}{" "}
              waiting for review

            </p>

          </div>

          <button
            onClick={() =>
              setPage(
                "admin-pharmacy-approval"
              )
            }
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            View All
          </button>

        </div>

        {pendingPharmacyList.length === 0 ? (

          <div className="p-10 text-center">

            <CheckCircle
              size={36}
              className="mx-auto text-green-300 mb-3"
            />

            <p className="text-sm text-slate-500">
              No pending pharmacy approvals
            </p>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-100">

              <tr>

                {[
                  "Pharmacy",
                  "Owner",
                  "Address",
                  "Applied",
                  "Status",
                  "Actions"
                ].map(h => (

                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-50">

              {pendingPharmacyList.map(
                (ph: any) => (

                  <tr
                    key={ph.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >

                    <td className="px-6 py-4">

                      <p className="text-sm font-semibold text-slate-800">
                        {ph.pharmacy_name}
                      </p>

                      <p className="text-xs text-slate-400">
                        ID #{ph.id}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {ph.owner_name || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {ph.address || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">

                      {ph.created_at
                        ? new Date(
                            ph.created_at
                          ).toLocaleDateString()
                        : "—"}

                    </td>

                    <td className="px-6 py-4">

                      <Badge
                        label="Pending"
                        variant="yellow"
                      />

                    </td>

                    <td className="px-6 py-4">

                      <button
                        onClick={() =>
                          setPage(
                            "admin-pharmacy-approval"
                          )
                        }
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Review
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

      {/* ========================================
          FOOTER
      ======================================== */}

      <div className="flex justify-end">

        <button
          onClick={loadDashboard}
          className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Refresh Dashboard
        </button>

      </div>

    </div>
  );
}

function AdminUserManagement() {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");


  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "/user/admin/all"
      );

      console.log(
        "Admin Users Response:",
        response.data
      );

      if (!response.data?.success) {

        throw new Error(
          response.data?.message ||
          "Failed to load users"
        );

      }

      setUsers(
        response.data.users || []
      );

    } catch (error: any) {

      console.error(
        "Failed to load users:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    loadUsers();

  }, []);


  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers =
    users.filter((user) => {

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(user.full_name || "")
          .toLowerCase()
          .includes(searchText) ||

        String(user.email || "")
          .toLowerCase()
          .includes(searchText) ||

        String(user.phone || "")
          .toLowerCase()
          .includes(searchText);


      const matchesRole =
        roleFilter === "all" ||
        String(user.role || "").toLowerCase() ===
        roleFilter.toLowerCase();


      return (
        matchesSearch &&
        matchesRole
      );

    });


  // ==========================================
  // ROLE BADGE
  // ==========================================

  const getRoleStyle = (role: string) => {

    switch (
      String(role).toLowerCase()
    ) {

      case "admin":
        return "bg-purple-50 text-purple-700";

      case "pharmacy":
        return "bg-green-50 text-green-700";

      case "customer":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-slate-50 text-slate-600";

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="p-6">

        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Loading users...
          </p>

        </div>

      </div>
    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="p-6 space-y-5">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            User Management
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage registered MediFind BD users
          </p>

        </div>


        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Refresh
        </button>

      </div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-4 gap-5">

        <StatCard
          icon={Users}
          label="Total Users"
          value={String(users.length)}
          sub="registered users"
          color="bg-blue-500"
        />

        <StatCard
          icon={User}
          label="Customers"
          value={String(
            users.filter(
              u => u.role === "customer"
            ).length
          )}
          sub="customer accounts"
          color="bg-green-500"
        />

        <StatCard
          icon={Building2}
          label="Pharmacy Users"
          value={String(
            users.filter(
              u => u.role === "pharmacy"
            ).length
          )}
          sub="pharmacy accounts"
          color="bg-amber-500"
        />

        <StatCard
          icon={Shield}
          label="Admins"
          value={String(
            users.filter(
              u => u.role === "admin"
            ).length
          )}
          sub="admin accounts"
          color="bg-purple-500"
        />

      </div>


      {/* SEARCH + FILTER */}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

        <div className="flex gap-3">

          {/* SEARCH */}

          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 outline-none text-sm text-slate-700"
              placeholder="Search by name, email or phone..."
            />

          </div>


          {/* ROLE FILTER */}

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none"
          >

            <option value="all">
              All Roles
            </option>

            <option value="customer">
              Customers
            </option>

            <option value="pharmacy">
              Pharmacy
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

        </div>

      </div>


      {/* USER TABLE */}

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100">

          <h3 className="font-bold text-slate-800">
            Registered Users
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {filteredUsers.length} users found
          </p>

        </div>


        {filteredUsers.length === 0 ? (

          <div className="p-10 text-center">

            <Users
              size={40}
              className="mx-auto text-slate-300 mb-3"
            />

            <p className="text-sm text-slate-500">
              No users found
            </p>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-100">

              <tr>

                {[
                  "ID",
                  "User",
                  "Email",
                  "Phone",
                  "Role"
                ].map((heading) => (

                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {heading}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-50">

              {filteredUsers.map(
                (user) => (

                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50"
                  >

                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      #{user.id}
                    </td>


                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">

                          <User
                            size={16}
                            className="text-blue-500"
                          />

                        </div>

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            {user.full_name || "—"}
                          </p>

                        </div>

                      </div>

                    </td>


                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.email || "—"}
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.phone || "—"}
                    </td>


                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {String(
                          user.role || "unknown"
                        )
                          .charAt(0)
                          .toUpperCase() +
                          String(
                            user.role || "unknown"
                          ).slice(1)}

                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );
}

function AdminPharmacyApproval() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // ==========================================
  // LOAD ALL PHARMACIES
  // ==========================================

  const loadPharmacies = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/pharmacies/all"
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load pharmacies");
      }

      setPharmacies(data.pharmacies || []);
    } catch (error) {
      console.error("Failed to load pharmacies:", error);
      alert("Failed to load pharmacies.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadPharmacies();
  }, []);

  // ==========================================
  // APPROVE PHARMACY
  // ==========================================

  const approvePharmacy = async (id: number) => {
    try {
      setProcessingId(id);

      const response = await fetch(
        `http://localhost:5000/api/pharmacies/${id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",

            // Send token because your backend route uses verifyToken
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to approve pharmacy"
        );
      }

      alert("Pharmacy approved successfully.");

      // Reload database data
      await loadPharmacies();
    } catch (error: any) {
      console.error("Approve pharmacy error:", error);

      alert(
        error?.message || "Failed to approve pharmacy."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // REJECT PHARMACY
  // ==========================================

  const rejectPharmacy = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this pharmacy?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(id);

      const response = await fetch(
        `http://localhost:5000/api/pharmacies/${id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",

            // Send token because your backend route uses verifyToken
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to reject pharmacy"
        );
      }

      alert("Pharmacy rejected successfully.");

      // Reload database data
      await loadPharmacies();
    } catch (error: any) {
      console.error("Reject pharmacy error:", error);

      alert(
        error?.message || "Failed to reject pharmacy."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const pendingCount = pharmacies.filter(
    (ph) =>
      String(ph.status).toLowerCase() === "pending"
  ).length;

  const approvedCount = pharmacies.filter(
    (ph) =>
      String(ph.status).toLowerCase() === "approved"
  ).length;

  const rejectedCount = pharmacies.filter(
    (ph) =>
      String(ph.status).toLowerCase() === "rejected"
  ).length;

  // ==========================================
  // PENDING PHARMACIES
  // ==========================================

  const pendingPharmacies = pharmacies.filter(
    (ph) =>
      String(ph.status).toLowerCase() === "pending"
  );

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Loading pharmacies...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6 space-y-5">

      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Pharmacy Approval
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Review and approve pharmacy registration requests
          </p>
        </div>

        <button
          onClick={loadPharmacies}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {/* ==========================================
          STAT CARDS
      ========================================== */}

      <div className="grid grid-cols-3 gap-5">

        <StatCard
          icon={AlertTriangle}
          label="Pending Review"
          value={String(pendingCount)}
          color="bg-amber-500"
        />

        <StatCard
          icon={CheckCircle}
          label="Approved"
          value={String(approvedCount)}
          color="bg-green-500"
        />

        <StatCard
          icon={XCircle}
          label="Rejected"
          value={String(rejectedCount)}
          color="bg-red-400"
        />

      </div>

      {/* ==========================================
          PENDING PHARMACIES
      ========================================== */}

      {pendingPharmacies.length === 0 ? (

        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-black/5">

          <CheckCircle
            size={42}
            className="mx-auto text-green-400 mb-3"
          />

          <h3 className="font-semibold text-slate-700">
            No pending pharmacies
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            There are no pharmacy registration requests waiting
            for approval.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {pendingPharmacies.map((ph) => (

            <div
              key={ph.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"
            >

              <div className="flex items-start justify-between">

                {/* PHARMACY INFORMATION */}

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                    <Building2
                      size={22}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-800">
                      {ph.pharmacy_name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {ph.owner_name || "Owner not provided"}
                    </p>

                    <div className="mt-2 space-y-1">

                      <p className="text-xs text-slate-400">
                        📍 {ph.address || "Address not provided"}
                      </p>

                      <p className="text-xs text-slate-400">
                        📞 {ph.phone || "Phone not provided"}
                      </p>

                      <p className="text-xs text-slate-400">
                        ✉️ {ph.email || "Email not provided"}
                      </p>

                    </div>

                    <div className="mt-3 flex gap-4 text-xs text-slate-400">

                      <span>
                        Applied: {formatDate(ph.created_at)}
                      </span>

                      <span>
                        User ID: {ph.user_id || "—"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* ACTION BUTTONS */}

                <div className="flex gap-2">

                  {/* VIEW */}

                  <button
                    onClick={() => {
                      alert(
                        `Pharmacy: ${ph.pharmacy_name}\n\n` +
                        `Owner: ${ph.owner_name || "N/A"}\n` +
                        `Phone: ${ph.phone || "N/A"}\n` +
                        `Email: ${ph.email || "N/A"}\n` +
                        `Address: ${ph.address || "N/A"}`
                      );
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl font-semibold hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Eye size={14} />
                    View
                  </button>

                  {/* APPROVE */}

                  <button
                    disabled={processingId === ph.id}
                    onClick={() =>
                      approvePharmacy(ph.id)
                    }
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >

                    <CheckCircle size={14} />

                    {processingId === ph.id
                      ? "Processing..."
                      : "Approve"}

                  </button>

                  {/* REJECT */}

                  <button
                    disabled={processingId === ph.id}
                    onClick={() =>
                      rejectPharmacy(ph.id)
                    }
                    className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded-xl font-semibold hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >

                    <XCircle size={14} />

                    Reject

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

function AdminMedicineManagement() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [newMedicine, setNewMedicine] = useState({
      brand_name: "",
      generic_name: "",
      manufacturer: "",
      category: "",
      strength: "",
      description: ""
  });

  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalCategories: 0,
    totalManufacturers: 0,
    totalGenerics: 0
});

  useEffect(() => {
    loadMedicines();
    loadStats();
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/medicines");
      const data = await response.json();
      setMedicines(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadStats = async () => {

    try {

        const response = await fetch(
            "http://localhost:5000/api/medicines/stats"
        );

        const data = await response.json();

        setStats(data);

    } catch (err) {

        console.log(err);

    }

};
  const addMedicine = async () => {

    try{

        const response = await fetch(
            "http://localhost:5000/api/medicines",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(newMedicine)
            }
        );

        const data = await response.json();

        if(data.success){

            alert("Medicine Added Successfully");

            setShowAddModal(false);

            setNewMedicine({
                brand_name:"",
                generic_name:"",
                manufacturer:"",
                category:"",
                strength:"",
                description:""
            });

            loadMedicines();
            loadStats();

        }

    }catch(err){

        console.log(err);

    }

};
const editMedicine = async () => {

    try {

        const response = await fetch(
            `http://localhost:5000/api/medicines/${editingId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newMedicine)
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Medicine Updated Successfully");

            setShowEditModal(false);

            loadMedicines();
            loadStats();

        }

    } catch (err) {

        console.log(err);

    }

};

const deleteMedicine = async (id: number) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/medicines/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Medicine Deleted Successfully");

            loadMedicines();
            loadStats();

        }

    } catch (err) {

        console.log(err);

    }

};
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medicine Master List</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the global medicine database</p>
        </div>
        <button
          onClick={()=>setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
      >
          <Plus size={16} />Add Medicine
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[["All Medicines", stats.totalMedicines, "bg-blue-500"],
          ["Categories", stats.totalCategories, "bg-green-500"],
          ["Manufacturers", stats.totalManufacturers, "bg-amber-500"],
          ["Generics", stats.totalGenerics, "bg-purple-500"]].map(([l, v, c]) => (
          <div key={l} className={`${c} rounded-2xl p-5 text-white`}>
            <p className="text-3xl font-bold">{v}</p>
            <p className="text-sm opacity-80 mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex gap-4">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-700"
              placeholder="Search medicine..."
          />
          </div>
          <select className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
            <option>All Categories</option>
            <option>Analgesic</option>
            <option>Antibiotic</option>
          </select>
          <select className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
            <option>All Manufacturers</option>
            <option>Beximco Pharma</option>
            <option>Square Pharma</option>
          </select>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Medicine", "Generic", "Manufacturer", "Category", "Strength", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {medicines
              .filter(m =>
                  m.brand_name.toLowerCase().includes(search.toLowerCase()) ||
                  m.generic_name.toLowerCase().includes(search.toLowerCase())
              )
              .map(m => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">{m.brand_name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{m.generic_name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{m.manufacturer}</td>
                <td className="px-6 py-4"><Badge label={m.category} variant="blue" /></td>
                <td className="px-6 py-4 text-sm text-slate-500">{m.strength}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                          onClick={() => {

                              setEditingId(m.id);

                              setNewMedicine({
                                  brand_name: m.brand_name,
                                  generic_name: m.generic_name,
                                  manufacturer: m.manufacturer,
                                  category: m.category,
                                  strength: m.strength,
                                  description: m.description || ""
                              });

                              setShowEditModal(true);

                          }}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                      >
                          <Edit2 size={14} />
                      </button>
                      <button
                            onClick={() => deleteMedicine(m.id)}
                            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                            <Trash2 size={14} />
                        </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl w-[500px] p-6 space-y-4">

          <h2 className="text-xl font-bold">
        Add Medicine
      </h2>

      <input
        placeholder="Brand Name"
        value={newMedicine.brand_name}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            brand_name:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="Generic Name"
        value={newMedicine.generic_name}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            generic_name:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="Manufacturer"
        value={newMedicine.manufacturer}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            manufacturer:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="Category"
        value={newMedicine.category}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            category:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="Strength"
        value={newMedicine.strength}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            strength:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <textarea
        placeholder="Description"
        value={newMedicine.description}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            description:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={()=>setShowAddModal(false)}
          className="px-5 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={addMedicine}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white"
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}

{showEditModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl w-[500px] p-6 space-y-4">

      <h2 className="text-xl font-bold">
        Edit Medicine
      </h2>

      <input
        placeholder="Brand Name"
        value={newMedicine.brand_name}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            brand_name:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="Generic Name"
        value={newMedicine.generic_name}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            generic_name:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="Manufacturer"
        value={newMedicine.manufacturer}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            manufacturer:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="Category"
        value={newMedicine.category}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            category:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        placeholder="Strength"
        value={newMedicine.strength}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            strength:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <textarea
        placeholder="Description"
        value={newMedicine.description}
        onChange={(e)=>
          setNewMedicine({
            ...newMedicine,
            description:e.target.value
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowEditModal(false)}
          className="px-5 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={editMedicine}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white"
        >
          Update
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Platform performance overview</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50">
          <Download size={16} />Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Most searched */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
          <h3 className="font-bold text-slate-800 mb-4">Most Searched Medicines</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={searchData} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="searches" fill="#2563eb" radius={[0, 4, 4, 0]} name="Searches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reservation stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
          <h3 className="font-bold text-slate-800 mb-4">Weekly Reservations</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="reservations" fill="#16a34a" radius={[4, 4, 0, 0]} name="Reservations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {[
          { title: "Medicine Search Stats", desc: "1,240 searches today", icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
          { title: "Reservation Report", desc: "342 this week", icon: FileText, color: "bg-green-50 text-green-600" },
          { title: "Pharmacy Performance", desc: "86 active pharmacies", icon: Building2, color: "bg-amber-50 text-amber-600" },
          { title: "User Growth", desc: "+248 this week", icon: Users, color: "bg-purple-50 text-purple-600" },
        ].map(c => (
          <div key={c.title} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:shadow-md cursor-pointer transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
              <c.icon size={18} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">{c.title}</h4>
            <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
            <button className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1">
              View Report <ChevronRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("Profile");
  const [fullName,setFullName]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");

  useEffect(()=>{

    loadProfile();

},[]);

  const loadProfile=async()=>{

    const token=localStorage.getItem("token");

    const response=await fetch(
        "http://localhost:5000/api/user/profile",
        {

            headers:{
                Authorization:`Bearer ${token}`
            }

        }
    );

    const data=await response.json();

    setFullName(data.full_name);
    setPhone(data.phone);
    setEmail(data.email);

}

const handleUpdateProfile=async()=>{

    const token=localStorage.getItem("token");

    const response=await fetch(
        "http://localhost:5000/api/user/profile",
        {

            method:"PUT",

            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },

            body:JSON.stringify({

                full_name:fullName,
                phone:phone

            })

        }
    );

    const data=await response.json();

    alert(data.message);

    loadProfile();

}

return (
  <div>
    {tab === "Profile" && (
      <div className="space-y-5">

        <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
            <User size={28} className="text-blue-600" />
          </div>

          <div>
            <p className="font-bold text-slate-800">{fullName}</p>
            <p className="text-sm text-slate-400">Patient Account</p>
            <button className="text-xs text-blue-600 hover:underline mt-1">
              Change Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Full Name
            </label>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Phone
            </label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Email
            </label>

            <input
              value={email}
              readOnly
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm"
            />
          </div>

        </div>

        <button
          onClick={handleUpdateProfile}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>

      </div>
    )}
  </div>
);
}

// ─── Main App ────────────────────────────────────────────────────────────────

function PharmacyReservations() {
  const PHARMACY_ID = 1;

  const [tab, setTab] = useState("Pending");
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    "Pending",
    "Approved",
    "Completed",
    "Rejected"
  ];

  // ==========================================
  // LOAD PHARMACY RESERVATIONS
  // ==========================================

  const loadReservations = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/reservations/pharmacy/${PHARMACY_ID}`
      );

      console.log(
        "Pharmacy reservations:",
        response.data
      );

      setReservations(
        response.data.reservations || []
      );

    } catch (error: any) {

      console.error(
        "Failed to load pharmacy reservations:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to load reservations."
      );

      setReservations([]);

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadReservations();
  }, []);


  // ==========================================
  // UPDATE RESERVATION STATUS
  // ==========================================

  const updateStatus = async (
    id: number,
    status: string
  ) => {

    try {

      await api.patch(
        `/reservations/${id}/status`,
        {
          status,
          pharmacy_id: PHARMACY_ID
        }
      );

      alert(
        `Reservation ${status}.`
      );

      await loadReservations();

    } catch (error: any) {

      console.error(
        "Reservation status error:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to update reservation."
      );

    }
  };


  // ==========================================
  // FILTER
  // ==========================================

  const filtered = reservations.filter(
    (r) =>
      String(r.status || "").toLowerCase() ===
      tab.toLowerCase()
  );


  // ==========================================
  // STATUS BADGE
  // ==========================================

  const statusVariant = (
    status: string
  ) => {

    switch (
      String(status).toLowerCase()
    ) {

      case "approved":
        return "blue";

      case "completed":
        return "green";

      case "rejected":
      case "cancelled":
        return "red";

      default:
        return "yellow";
    }
  };


  return (
    <div className="p-6 space-y-5">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Reservation Management
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage medicine reservations from patients
          </p>

        </div>


        <button
          onClick={loadReservations}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >

          <RefreshCw size={15} />

          Refresh

        </button>

      </div>


      {/* TABS */}

      <div className="flex gap-2">

        {tabs.map((t) => (

          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-black/5 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>

        ))}

      </div>


      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">

        {loading ? (

          <div className="p-10 text-center text-sm text-slate-500">

            Loading reservations...

          </div>

        ) : (

          <>

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-100">

                <tr>

                  {[
                    "ID",
                    "Patient",
                    "Medicine",
                    "Qty",
                    "Price",
                    "Date",
                    "Status",
                    "Actions"
                  ].map((h) => (

                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>

                  ))}

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-50">

                {filtered.map((r) => (

                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/50"
                  >

                    {/* ID */}

                    <td className="px-6 py-4 text-xs font-mono text-slate-400">

                      #{r.id}

                    </td>


                    {/* PATIENT */}

                    <td className="px-6 py-4">

                      <p className="text-sm font-semibold text-slate-800">

                        {r.full_name ||
                          r.email ||
                          `User ${r.user_id}`}

                      </p>

                    </td>


                    {/* MEDICINE */}

                    <td className="px-6 py-4">

                      <p className="text-sm font-semibold text-slate-700">

                        {r.brand_name}

                      </p>

                      <p className="text-xs text-slate-400">

                        {r.generic_name || ""}

                      </p>

                    </td>


                    {/* QUANTITY */}

                    <td className="px-6 py-4 text-sm font-semibold">

                      {r.quantity}

                    </td>


                    {/* PRICE */}

                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">

                      {r.price != null
                        ? `৳${Number(r.price).toFixed(2)}`
                        : "—"}

                    </td>


                    {/* DATE */}

                    <td className="px-6 py-4 text-sm text-slate-500">

                      {r.created_at
                        ? new Date(
                            r.created_at
                          ).toLocaleString()
                        : "—"}

                    </td>


                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <Badge
                        label={String(
                          r.status || "pending"
                        ).replace(
                          /^./,
                          (c) => c.toUpperCase()
                        )}
                        variant={statusVariant(
                          r.status
                        )}
                      />

                    </td>


                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      {String(
                        r.status
                      ).toLowerCase() === "pending" ? (

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              updateStatus(
                                r.id,
                                "approved"
                              )
                            }
                            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg font-semibold hover:bg-green-700 flex items-center gap-1"
                          >

                            <CheckCircle size={12} />

                            Approve

                          </button>


                          <button
                            onClick={() =>
                              updateStatus(
                                r.id,
                                "rejected"
                              )
                            }
                            className="px-3 py-1.5 bg-red-100 text-red-600 text-xs rounded-lg font-semibold hover:bg-red-200 flex items-center gap-1"
                          >

                            <XCircle size={12} />

                            Reject

                          </button>

                        </div>

                      ) : String(
                          r.status
                        ).toLowerCase() === "approved" ? (

                        <button
                          onClick={() =>
                            updateStatus(
                              r.id,
                              "completed"
                            )
                          }
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-semibold hover:bg-blue-700"
                        >

                          Mark Completed

                        </button>

                      ) : (

                        <span className="text-xs text-slate-400">

                          No action

                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>


            {/* EMPTY */}

            {filtered.length === 0 && (

              <div className="text-center py-12 text-slate-400">

                <ShoppingBag
                  size={32}
                  className="mx-auto mb-3 opacity-30"
                />

                <p className="text-sm">

                  No {tab.toLowerCase()} reservations

                </p>

              </div>

            )}

          </>

        )}

      </div>

    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [panel, setPanel] = useState<Panel>("public");

  const [selectedMedicine, setSelectedMedicine] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("selectedMedicine");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const isPublic = panel === "public";

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <HomePage
            setPage={setPage}
            setPanel={setPanel}
            setSelectedMedicine={setSelectedMedicine}
          />
        );
      case "login": return <LoginPage setPage={setPage} setPanel={setPanel} />;
      case "register": return <RegisterPage setPage={setPage} />;
      case "forgot-password": return <ForgotPasswordPage setPage={setPage} />;
      case "user-dashboard": return <UserDashboard setPage={setPage} />;
      case "admin-user-management": return <AdminUserManagement />;
      case "medicine-search":
        return (
          <MedicineSearchPage
            setPage={setPage}
            setSelectedMedicine={setSelectedMedicine}
          />
        );
        case "medicine-details":
          return (
            <MedicineDetailsPage
              setPage={setPage}
              selectedMedicine={selectedMedicine}
            />
          );

        case "my-reservations":
          return (
            <MyReservationsPage
              setPage={setPage}
            />
          );
      case "price-comparison": return <PriceComparisonPage setPage={setPage} />;
      case "pharmacy-locator": return <PharmacyLocatorPage />;
      case "pharmacy-dashboard": return <PharmacyDashboard setPage={setPage} />;
      case "pharmacy-inventory": return <PharmacyInventory />;
      case "pharmacy-reservations": return <PharmacyReservations />;
      case "pharmacy-profile": return <PharmacyProfile />;
      case "admin-dashboard": return <AdminDashboard setPage={setPage} />;
      case "admin-pharmacy-approval": return <AdminPharmacyApproval />;
      case "admin-medicine-management": return <AdminMedicineManagement />;
      case "reports": return <ReportsPage />;
      case "settings": return <SettingsPage />;
      default:
        return (
          <HomePage
            setPage={setPage}
            setPanel={setPanel}
            setSelectedMedicine={setSelectedMedicine}
          />
        );
    }
  };

  if (isPublic || page === "login" || page === "register" || page === "forgot-password") {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif" }} className="min-h-screen bg-background">
        {renderPage()}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }} className="flex h-screen bg-background overflow-hidden">
      <Sidebar panel={panel} page={page} setPage={setPage} setPanel={setPanel} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNav panel={panel} />
        <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
