import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Link2, 
  PlusCircle, 
  Package, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  ShieldCheck,
  Database
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Redemption Links', path: '/admin/links', icon: Link2 },
    { label: 'Create Links', path: '/admin/links/create', icon: PlusCircle },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-30">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md shadow-orange-500/20">
            <img src="/logo.png" alt="FOXMEDIA" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-white tracking-tight">Admin Portal</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-zinc-800/80 bg-zinc-900/95 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand & Connection State */}
          <div className="p-6 border-b border-zinc-800/80">
            <div className="flex items-center justify-between">
              <Link to="/admin/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-orange-500/20">
                  <img src="/logo.png" alt="FOXMEDIA" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="font-bold text-base text-white tracking-tight leading-none">
                    FOXMEDIA
                  </h1>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Admin Portal
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Supabase Status Indicator */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-zinc-400" />
                Database:
              </span>
              {isSupabaseConfigured() ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 font-medium" title="Configure VITE_SUPABASE_URL in .env to connect live Supabase">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Local Preview
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-orange-500 text-white font-semibold shadow-lg shadow-orange-950/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User profile & actions */}
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40 space-y-3">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-orange-400 border border-zinc-700">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.email || 'admin@foxmedia.com'}</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Admin
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 rounded-lg bg-zinc-800 hover:bg-rose-950/50 hover:text-rose-400 text-zinc-400 transition"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-zinc-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
