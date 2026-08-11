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
  | "user-dashboard" | "medicine-search" | "medicine-details"
  | "price-comparison" | "pharmacy-locator"
  | "pharmacy-dashboard" | "pharmacy-inventory" | "pharmacy-reservations" | "pharmacy-profile"
  | "admin-dashboard" | "admin-pharmacy-approval" | "admin-medicine-management"
  | "reports" | "settings";

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
    { icon: ShoppingBag, label: "My Reservations", page: "medicine-details" as Page },
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
    { icon: Users, label: "User Management", page: "admin-dashboard" as Page },
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

function LoginPage({ setPage, setPanel }: { setPage: (p: Page) => void; setPanel: (p: Panel) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {

    try{

        const response = await fetch("http://localhost:5000/api/auth/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        if(data.success){

            localStorage.setItem("token",data.token);

            localStorage.setItem("user",JSON.stringify(data.user));

            localStorage.setItem("role", data.user.role);

            if(data.user.role==="customer"){

                setPanel("user");
                setPage("user-dashboard");
            }

            else if(data.user.role==="pharmacy"){

                setPanel("pharmacy");
                setPage("pharmacy-dashboard");

            }

            else if(data.user.role==="admin"){

                setPanel("admin");
                setPage("admin-dashboard");

            }

        }

        else{

            alert(data.message);

        }

    }

    catch(err){

        alert("Server Error");

    }

  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your MediFind BD account</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone / Email</label>
             <input
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="01XXXXXXXXX or email@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                  />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                 <input
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                    />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <button onClick={() => setPage("forgot-password")} className="text-blue-600 hover:underline">Forgot password?</button>
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            Sign In
          </button>
          <div className="mt-4 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <button onClick={() => setPage("register")} className="text-blue-600 font-semibold hover:underline">Register now</button>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          <button onClick={() => setPage("home")} className="hover:text-blue-600">← Back to Home</button>
        </p>
      </div>
    </div>
  );
}

function RegisterPage({ setPage }: { setPage: (p: Page) => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleRegister = async () => {

    try {

        const response = await fetch("http://localhost:5000/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                full_name: fullName,
                email,
                phone,
                password,
                role

            })

        });

        const data = await response.json();

        if (data.success) {

            alert("Registration Successful!");

            setPage("login");

        } else {

            alert(data.message);

        }

    } catch (error) {

        alert("Server Error");

    }

  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-4">
            <User size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join MediFind BD as a patient</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                <input
                    value={fullName}
                    onChange={(e)=>setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="Rafiqul"
                    />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Islam" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <input
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="01XXXXXXXXX"
                    />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email (Optional)</label>
              <input
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="email@example.com"
                    />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="Min. 8 characters"
                    />
            </div>
            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Address
            </label>

            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Enter your address"
            />
            </div>
            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Register As
            </label>

            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200"
            >
                <option value="customer">Customer</option>
                <option value="pharmacy">Pharmacy</option>
            </select>
            </div>

            {role === "pharmacy" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Pharmacy Name
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200"
                    placeholder="ABC Pharmacy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    License Number
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200"
                    placeholder="DGDA-123456"
                  />
                </div>
              </>
            )}

          </div>
          <button
              onClick={handleRegister}
              className="w-full mt-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors shadow-sm"
          >
              Create Account
          </button>
          <div className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button onClick={() => setPage("login")} className="text-blue-600 font-semibold hover:underline">Sign in</button>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          <button onClick={() => setPage("home")} className="hover:text-blue-600">← Back to Home</button>
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
          <h3 className="font-bold text-slate-800 mb-4">My Reservations</h3>
          <div className="space-y-3">
            {[].map(r => (
              <div key={r.med} className="p-3 rounded-xl bg-slate-50 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{r.med}</p>
                  <p className="text-xs text-slate-400">{r.ph}</p>
                </div>
                <Badge label={r.status} variant={r.status === "Approved" ? "green" : "yellow"} />
              </div>
            ))}
          </div>
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

  // ==========================================
  // LOAD MEDICINE AVAILABILITY
  // ==========================================

  const loadMedicines = async (searchText = "") => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/medicines/availability/search?search=${encodeURIComponent(searchText)}`
      );

      const data = await response.json();

      if (!data.success) {
        console.error("Failed to load medicines");
        setMedicines([]);
        return;
      }

      // ==========================================
      // GROUP PHARMACY RESULTS BY MEDICINE
      // ==========================================

      const grouped: Record<number, any> = {};

      (data.results || []).forEach((item: any) => {
        if (!grouped[item.medicine_id]) {
          grouped[item.medicine_id] = {
            id: item.medicine_id,
            brand_name: item.brand_name,
            generic_name: item.generic_name,
            strength: item.strength,
            dosage_form: item.dosage_form,
            manufacturer: item.manufacturer || item.mfr || "",
            category: item.category || "",
            description: item.description || "",
            uses: item.uses || "",
            dosage: item.dosage || "",
            side_effects: item.side_effects || "",

            pharmacies: [],
            available: 0,
            price: Number(item.price) || 0,
          };
        }

        grouped[item.medicine_id].pharmacies.push(item);

        // Count pharmacies where stock is available
        if (Number(item.stock) > 0) {
          grouped[item.medicine_id].available += 1;
        }

        // Find lowest price
        if (
          Number(item.price) > 0 &&
          (
            grouped[item.medicine_id].price === 0 ||
            Number(item.price) < grouped[item.medicine_id].price
          )
        ) {
          grouped[item.medicine_id].price = Number(item.price);
        }
      });

      setMedicines(Object.values(grouped));

    } catch (error) {
      console.error("Failed to load medicine availability:", error);
      setMedicines([]);
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
    loadMedicines(search);
  };


  return (
    <div className="p-6 space-y-5">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Find Medicine
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Search medicines and compare prices across pharmacies
        </p>
      </div>


      {/* SEARCH BOX */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">

        <div className="flex gap-3">

          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Search
          </button>

        </div>

      </div>


      {/* RESULT COUNT */}
      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {loading
            ? "Searching..."
            : `${medicines.length} medicines found`}
        </p>

        {search && !loading && (
          <button
            onClick={() => {
              setSearch("");
              loadMedicines("");
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear Search
          </button>
        )}

      </div>


      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-black/5">

          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />

          <p className="text-sm text-slate-500">
            Searching medicines...
          </p>

        </div>
      )}


      {/* NO RESULTS */}
      {!loading && medicines.length === 0 && (
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


      {/* MEDICINE CARDS */}
      {!loading && medicines.length > 0 && (

        <div className="grid grid-cols-3 gap-5">

          {medicines.map((med) => (

            <div
              key={med.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 hover:shadow-md transition-shadow"
            >

              {/* MEDICINE HEADER */}
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
                    {med.generic_name || "Generic name not available"}
                  </p>

                  {med.strength && (
                    <p className="text-xs text-slate-400 mt-1">
                      {med.strength}
                    </p>
                  )}

                </div>

              </div>


              {/* AVAILABILITY + PRICE */}
              <div className="flex items-center justify-between py-3 border-t border-slate-50">

                <div>

                  <p className="text-xs text-slate-400">
                    Available at
                  </p>

                  <p className="text-2xl font-bold text-green-600">
                    {Number(med.available) || 0}
                  </p>
                </div>


                <div className="text-right">

                  <p className="text-xs text-slate-400">
                    Lowest Price
                  </p>

                  <p className="text-xl font-bold text-blue-600">
                    {med.price > 0
                      ? `৳${med.price.toFixed(2)}`
                      : "N/A"}
                  </p>

                </div>

              </div>


              {/* BUTTONS */}
              <div className="flex gap-2 mt-3">

                <button
                  onClick={() => {
                    localStorage.setItem(
                      "selectedMedicine",
                      JSON.stringify(med)
                    );

                    setPage("price-comparison");
                  }}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Compare Prices
                </button>


                  <button
                      onClick={() => {
                        setSelectedMedicine(med);
                        localStorage.setItem("selectedMedicine", JSON.stringify(med));
                        setPage("medicine-details");
                      }}
                    >
                      Details
                    </button>


                <button
                  onClick={() => {
                    localStorage.setItem(
                      "selectedMedicine",
                      JSON.stringify(med)
                    );

                    setPage("medicine-details");
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
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showReserveModal, setShowReserveModal] = useState(false);
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
          // TEMPORARY USER ID
          // Later this will come from logged-in user.
          user_id: 1,

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

                      if (availability.length === 0) {

                        alert(
                          "This medicine is currently unavailable."
                        );

                        return;
                      }

                      openReserveModal(
                        availability[0]
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
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pharmacy Locator</h1>
        <p className="text-slate-500 text-sm mt-1">Find verified pharmacies near your location</p>
      </div>
      <div className="grid grid-cols-3 gap-5" style={{ height: 580 }}>
        <div className="space-y-3 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
          {PHARMACIES.map(ph => (
            <div
              key={ph.id}
              onClick={() => setSelected(ph.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${selected === ph.id ? "border-blue-400 bg-blue-50" : "border-black/5 bg-white hover:shadow-sm"}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-slate-800 text-sm">{ph.name}</h3>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star size={10} fill="currentColor" />{ph.rating}
                </div>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-2"><MapPin size={10} />{ph.area}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Navigation size={10} className="text-blue-400" />{ph.distance}</span>
                <span className="flex items-center gap-1"><Clock size={10} className="text-green-400" />{ph.hours}</span>
                <span className="flex items-center gap-1"><Phone size={10} className="text-slate-400" />{ph.phone}</span>
                <span className="flex items-center gap-1"><Package size={10} className="text-slate-400" />{ph.stock} items</span>
              </div>
              <button className="mt-3 w-full py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Navigation size={12} />Get Directions
              </button>
            </div>
          ))}
        </div>
        <div className="col-span-2 bg-slate-200 rounded-2xl overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&h=600&fit=crop&auto=format"
            alt="Map view of Dhaka showing pharmacy locations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/10" />
          <div className="absolute top-4 left-4 bg-white rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            📍 Dhanmondi, Dhaka
          </div>
          {PHARMACIES.map((ph, i) => (
            <div
              key={ph.id}
              onClick={() => setSelected(ph.id)}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-lg transition-all ${selected === ph.id ? "bg-blue-600 scale-125" : "bg-green-500 hover:scale-110"}`}
              style={{ left: `${20 + i * 18}%`, top: `${30 + (i % 2) * 25}%` }}
            >
              {i + 1}
            </div>
          ))}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold">+</button>
            <button className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold">−</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PharmacyDashboard({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pharmacy Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Dhaka Medical Pharmacy · Shahbag, Dhaka</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Open Now
          </span>
          <button onClick={() => setPage("pharmacy-inventory")} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />Add Medicine
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <StatCard icon={Package} label="Total Medicines" value="342" sub="in inventory" color="bg-blue-500" />
        <StatCard icon={CheckCircle} label="Available" value="298" sub="87% in stock" color="bg-green-500" />
        <StatCard icon={ShoppingBag} label="Today's Reservations" value="18" sub="6 pending" color="bg-amber-500" />
        <StatCard icon={Users} label="Total Customers" value="1,240" sub="this month" color="bg-purple-500" />
      </div>

      {/* Low stock alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Low Stock Alert</p>
          <p className="text-xs text-amber-600">Seclo 20 (12 units), Losectil 500 (7 units) are running low. Please restock soon.</p>
        </div>
        <button onClick={() => setPage("pharmacy-inventory")} className="ml-auto text-xs font-semibold text-amber-700 hover:underline whitespace-nowrap">Update Stock</button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Sales chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
          <h3 className="font-bold text-slate-800 mb-4">Weekly Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="reservations" fill="#2563eb" radius={[4, 4, 0, 0]} name="Reservations" />
              <Bar dataKey="customers" fill="#16a34a" radius={[4, 4, 0, 0]} name="Customers" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent reservations */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Reservations</h3>
            <button onClick={() => setPage("pharmacy-reservations")} className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {RESERVATIONS.slice(0, 4).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{r.patient}</p>
                  <p className="text-xs text-slate-400">{r.medicine} × {r.qty}</p>
                </div>
                <Badge
                  label={r.status}
                  variant={r.status === "Pending" ? "yellow" : r.status === "Approved" ? "blue" : r.status === "Completed" ? "green" : "red"}
                />
              </div>
            ))}
          </div>
        </div>
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

    // TEMPORARY pharmacy ID
    // Later this will come from the logged-in pharmacy account.
    const PHARMACY_ID = 1;


    // ==========================================
    // LOAD PHARMACY INVENTORY
    // ==========================================

const loadInventory = async () => {

    try {

        console.log("Loading inventory...");

        const response = await api.get(
            `/inventory/pharmacy/${PHARMACY_ID}`
        );

        console.log("Inventory response:", response.data);

        setInventory(
            response.data.inventory || []
        );

    } catch (error) {

        console.error(
            "Inventory loading error:",
            error
        );

    }

};
useEffect(() => {

    loadInventory();
    loadMedicines();

}, []);


    // ==========================================
    // LOAD MEDICINES
    // ==========================================

    const loadMedicines = async () => {

        try {

            const response = await api.get("/medicines");

            setMedicines(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load medicines",
                error
            );

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

    const filtered = inventory.filter(item => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            String(item.brand_name || "")
                .toLowerCase()
                .includes(searchText) ||

            String(item.generic_name || "")
                .toLowerCase()
                .includes(searchText);


        const matchesStatus =
            statusFilter === "All Status" ||

            (
                statusFilter === "Available" &&
                item.stock >= 15
            ) ||

            (
                statusFilter === "Low Stock" &&
                item.stock > 0 &&
                item.stock < 15
            ) ||

            (
                statusFilter === "Out of Stock" &&
                item.stock === 0
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


        try {

            if (editingItem) {

                // UPDATE EXISTING INVENTORY

                await api.put(
                    `/inventory/${editingItem.id}`,
                    {
                        stock: Number(form.stock),
                        price: Number(form.price)
                    }
                );

                alert("Inventory updated successfully.");

            } else {

                // ADD NEW INVENTORY

                await api.post(
                    "/inventory",
                    {
                        pharmacy_id: PHARMACY_ID,
                        medicine_id: Number(form.medicine_id),
                        stock: Number(form.stock),
                        price: Number(form.price)
                    }
                );

                alert("Medicine added to inventory.");

            }


            setShowModal(false);

            setEditingItem(null);

            setForm({
                medicine_id: "",
                stock: "",
                price: ""
            });

            await loadInventory();


        } catch (error: any) {

            console.error(
                "Inventory save error:",
                error
            );


            if (
                error.response &&
                error.response.status === 409
            ) {

                alert(
                    "This medicine already exists in this pharmacy inventory."
                );

            } else {

                alert(
                    error.response?.data?.message ||
                    "Failed to save inventory."
                );

            }

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
                error
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
                            onChange={e =>
                                setSearch(e.target.value)
                            }
                            className="flex-1 outline-none text-sm text-slate-700"
                            placeholder="Search medicine..."
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={e =>
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

                        {filtered.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-sm text-slate-400"
                                >
                                    No inventory items found.
                                </td>

                            </tr>

                        ) : (

                            filtered.map(item => (

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
                                                {item.brand_name}
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
                                                item.stock === 0
                                                    ? "text-red-500"
                                                    : item.stock < 15
                                                    ? "text-amber-500"
                                                    : "text-slate-800"
                                            }`}
                                        >
                                            {item.stock}
                                        </span>

                                    </td>


                                    {/* Price */}

                                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">

                                        ৳{Number(item.price).toFixed(2)}

                                    </td>


                                    {/* Status */}

                                    <td className="px-6 py-4">

                                        <Badge
                                            label={
                                                item.stock === 0
                                                    ? "Out of Stock"
                                                    : item.stock < 15
                                                    ? "Low Stock"
                                                    : "Available"
                                            }
                                            variant={
                                                item.stock === 0
                                                    ? "red"
                                                    : item.stock < 15
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

                            ))

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
                                        : "Add Medicine to Inventory"}

                                </h2>

                                <p className="text-xs text-slate-400 mt-1">

                                    {editingItem
                                        ? "Update stock and selling price"
                                        : "Add a medicine to your pharmacy"}

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
                                onChange={e =>
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

                                {medicines.map(medicine => (

                                    <option
                                        key={medicine.id}
                                        value={medicine.id}
                                    >
                                        {medicine.brand_name}
                                        {medicine.generic_name
                                            ? ` - ${medicine.generic_name}`
                                            : ""}
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
                                onChange={e =>
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
                                onChange={e =>
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
                                    : "Add Medicine"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

function PharmacyReservations() {
  const [tab, setTab] = useState("Pending");
  const tabs = ["Pending", "Approved", "Completed", "Rejected"];
  const filtered = RESERVATIONS.filter(r => r.status === tab);
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reservation Management</h1>
        <p className="text-slate-500 text-sm mt-1">Manage medicine reservations from patients</p>
      </div>
      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 border border-black/5 hover:bg-slate-50"}`}
          >{t}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["ID", "Patient", "Medicine", "Qty", "Date", "Status", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(filtered.length > 0 ? filtered : RESERVATIONS).map(r => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-slate-400">{r.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">{r.patient}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{r.medicine}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{r.qty}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{r.date}</td>
                <td className="px-6 py-4">
                  <Badge label={r.status} variant={r.status === "Pending" ? "yellow" : r.status === "Approved" ? "blue" : r.status === "Completed" ? "green" : "red"} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {r.status === "Pending" && (
                      <>
                        <button className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg font-semibold hover:bg-green-700 flex items-center gap-1">
                          <CheckCircle size={12} />Approve
                        </button>
                        <button className="px-3 py-1.5 bg-red-100 text-red-600 text-xs rounded-lg font-semibold hover:bg-red-200 flex items-center gap-1">
                          <XCircle size={12} />Reject
                        </button>
                      </>
                    )}
                    {r.status !== "Pending" && (
                      <button className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs rounded-lg font-semibold hover:bg-slate-50 flex items-center gap-1">
                        <Eye size={12} />View
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No {tab.toLowerCase()} reservations</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PharmacyProfile() {
  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">Pharmacy Profile</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
            <Building2 size={28} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dhaka Medical Pharmacy</h2>
            <p className="text-slate-500 text-sm">License: DDA-2019-0042 · Verified</p>
            <Badge label="Active" variant="green" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            { label: "Owner Name", value: "Md. Zahirul Islam" },
            { label: "Phone Number", value: "01711-234567" },
            { label: "Email", value: "dhaka.medical@pharmacy.bd" },
            { label: "Area / Thana", value: "Shahbag, Dhaka" },
            { label: "Full Address", value: "123 Shahbag Avenue, Dhaka-1000" },
            { label: "Opening Hours", value: "Open 24 Hours" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{f.label}</label>
              <input defaultValue={f.value} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          ))}
        </div>
        <button className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function AdminDashboard({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">MediFind BD System Overview · 27 Jun 2026</p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <StatCard icon={Users} label="Total Users" value="12,480" sub="+248 this week" color="bg-blue-500" />
        <StatCard icon={Building2} label="Pharmacies" value="86" sub="3 pending approval" color="bg-green-500" />
        <StatCard icon={Pill} label="Medicines" value="1,240" sub="in master list" color="bg-amber-500" />
        <StatCard icon={ShoppingBag} label="Total Reservations" value="8,340" sub="this month" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* User growth chart */}
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-black/5">
          <h3 className="font-bold text-slate-800 mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { month: "Jan", users: 4200, pharmacies: 52 },
              { month: "Feb", users: 5800, pharmacies: 58 },
              { month: "Mar", users: 7200, pharmacies: 63 },
              { month: "Apr", users: 8900, pharmacies: 70 },
              { month: "May", users: 10400, pharmacies: 78 },
              { month: "Jun", users: 12480, pharmacies: 86 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
          <h3 className="font-bold text-slate-800 mb-4">Medicine Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-slate-600">{c.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending pharmacies */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Pending Pharmacy Approvals</h3>
          <button onClick={() => setPage("admin-pharmacy-approval")} className="text-xs text-blue-600 font-semibold hover:underline">View All</button>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Pharmacy", "Owner", "Area", "Applied", "License", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {PENDING_PHARMACIES.map(ph => (
              <tr key={ph.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">{ph.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{ph.owner}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{ph.area}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{ph.applied}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{ph.license}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg font-semibold hover:bg-green-700 flex items-center gap-1">
                      <CheckCircle size={12} />Approve
                    </button>
                    <button className="px-3 py-1.5 bg-red-100 text-red-600 text-xs rounded-lg font-semibold hover:bg-red-200 flex items-center gap-1">
                      <XCircle size={12} />Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPharmacyApproval() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pharmacy Approval</h1>
        <p className="text-slate-500 text-sm mt-1">Review and approve pharmacy registration requests</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <StatCard icon={AlertTriangle} label="Pending Review" value="3" color="bg-amber-500" />
        <StatCard icon={CheckCircle} label="Approved" value="86" color="bg-green-500" />
        <StatCard icon={XCircle} label="Rejected" value="12" color="bg-red-400" />
      </div>
      <div className="space-y-4">
        {PENDING_PHARMACIES.map(ph => (
          <div key={ph.id} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Building2 size={22} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{ph.name}</h3>
                  <p className="text-sm text-slate-500">{ph.owner} · {ph.area}</p>
                  <div className="mt-2 flex gap-4 text-xs text-slate-400">
                    <span>Applied: {ph.applied}</span>
                    <span>License: {ph.license}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl font-semibold hover:bg-slate-50 flex items-center gap-2">
                  <Eye size={14} />View Docs
                </button>
                <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl font-semibold hover:bg-green-700 flex items-center gap-2">
                  <CheckCircle size={14} />Approve
                </button>
                <button className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded-xl font-semibold hover:bg-red-200 flex items-center gap-2">
                  <XCircle size={14} />Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

  const openReservation = (medicine: any, pharmacy: any = null) => {
  setSelectedMedicine(medicine);
  setSelectedPharmacy(pharmacy);
  setShowReservationModal(true);
};

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
const ReservationModal = () => {
  if (!showReservationModal || !selectedMedicine) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Reserve Medicine
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Reserve your medicine from the pharmacy
            </p>
          </div>

          <button
            onClick={() => setShowReservationModal(false)}
            className="text-slate-400 hover:text-slate-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-5">
          <p className="font-bold text-slate-800">
            {selectedMedicine.name ||
              selectedMedicine.brand_name}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            {selectedMedicine.generic ||
              selectedMedicine.generic_name ||
              "Generic name not available"}
          </p>

          <p className="text-sm text-slate-500">
            {selectedMedicine.strength || ""}
          </p>
        </div>

        {selectedPharmacy && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Pharmacy
            </label>

            <div className="border border-slate-200 rounded-xl p-3">
              <p className="font-semibold text-slate-800">
                {selectedPharmacy.pharmacy_name ||
                  selectedPharmacy.name}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {selectedPharmacy.address ||
                  selectedPharmacy.area ||
                  "Address unavailable"}
              </p>

              {selectedPharmacy.price && (
                <p className="text-sm font-bold text-blue-600 mt-2">
                  ৳{selectedPharmacy.price}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Quantity
          </label>

          <input
            type="number"
            min="1"
            defaultValue="1"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => setShowReservationModal(false)}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              alert("Medicine reserved successfully!");
              setShowReservationModal(false);
            }}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            Confirm Reservation
          </button>

        </div>

      </div>
    </div>
  );
};

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }} className="flex h-screen bg-background overflow-hidden">
      <Sidebar panel={panel} page={page} setPage={setPage} setPanel={setPanel} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNav panel={panel} />
        <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {renderPage()}
        </main>
      </div>
      <ReservationModal />
    </div>
  );
}
