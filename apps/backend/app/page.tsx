"use client";

import Link from "next/link";
import { 
  Database, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  LayoutDashboard, 
  Lock, 
  Terminal,
  Activity,
  Server,
  Cloud,
  Cpu,
  ChevronRight
} from "lucide-react";
import { ApiExplorer } from "../components/ApiExplorer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white uppercase">Backend<span className="text-blue-500">Core</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/admin/blog" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <Activity className="w-3 h-3 animate-pulse" />
            System Operational
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
            Modern Infrastructure for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              High-Velocity Applications
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-light">
            A secure, scalable, and performance-optimized backend powered by Next.js 15, Prisma, and PostgreSQL. Integrated with AI capabilities and global CDNs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link 
              href="/admin/blog"
              className="px-8 py-3.5 bg-white text-slate-950 rounded-xl font-semibold flex items-center gap-2 shadow-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => document.getElementById('api-reference')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-slate-900 text-white border border-white/10 rounded-xl font-semibold hover:bg-slate-800 transition-all active:scale-95"
            >
              API Reference
            </button>
          </div>
        </section>

        {/* System Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-slideUp">
          {[
            { label: "Uptime", value: "99.98%", icon: Server, color: "text-emerald-400" },
            { label: "Latency", value: "48ms", icon: Zap, color: "text-amber-400" },
            { label: "Security", value: "L7-Ready", icon: ShieldCheck, color: "text-blue-400" },
            { label: "Instances", value: "Edge-Auto", icon: Cloud, color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group hover:border-white/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">{stat.value}</div>
            </div>
          ))}
        </section>

        {/* Feature Grid */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Core Capabilities</h2>
              <p className="text-slate-400">Everything you need to scale your project from zero to production.</p>
            </div>
            <Link href="/admin/blog" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 group">
              Explore All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Post Card */}
            <div className="group relative overflow-hidden p-8 bg-gradient-to-b from-slate-900 to-[#020617] border border-white/10 rounded-3xl transition-all hover:border-blue-500/50">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <LayoutDashboard className="w-24 h-24 text-blue-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="p-3 w-fit bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Admin Console</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Enterprise-grade dashboard for managing content, products, and user permissions with complete audit logs.
                </p>
                <Link 
                  href="/admin/blog" 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  Go to Console <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Auth Card */}
            <div className="group relative overflow-hidden p-8 bg-gradient-to-b from-slate-900 to-[#020617] border border-white/10 rounded-3xl transition-all hover:border-purple-500/50">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lock className="w-24 h-24 text-purple-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="p-3 w-fit bg-purple-600 rounded-2xl shadow-lg shadow-purple-500/20">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Secure Auth</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  NextAuth.js integration providing secure sessions, role-based access control, and multi-provider support.
                </p>
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300"
                >
                  Manage Users <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* AI Card */}
            <div className="group relative overflow-hidden p-8 bg-gradient-to-b from-slate-900 to-[#020617] border border-white/10 rounded-3xl transition-all hover:border-amber-500/50">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu className="w-24 h-24 text-amber-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="p-3 w-fit bg-amber-600 rounded-2xl shadow-lg shadow-amber-500/20">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Services</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Built-in AI pipelines for content generation, image analysis, and automated metadata optimization.
                </p>
                <div className="text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase font-bold tracking-wider">
                  Experimental
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference Explorer */}
        <section id="api-reference" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Interactive Documentation</h2>
            <p className="max-w-xl mx-auto text-slate-400">
              Explore our RESTful API endpoints. Each route is designed with performance and simplicity in mind.
            </p>
          </div>
          <ApiExplorer />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#010413]">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-12 mb-12 text-center md:text-left">
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-bold tracking-tight text-white uppercase">Backend<span className="text-blue-500">Core</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Empowering developers to build beautiful, fast, and scalable web applications without the infrastructure headache.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
              <div className="space-y-4">
                <h4 className="font-bold text-white">Platform</h4>
                <ul className="space-y-2 text-slate-500">
                  <li><Link href="/admin/blog" className="hover:text-blue-400 transition-colors">Admin Dashboard</Link></li>
                  <li><Link href="/api/blog" className="hover:text-blue-400 transition-colors">API Explorer</Link></li>
                  <li><Link href="/login" className="hover:text-blue-400 transition-colors">Authentication</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-white">Resources</h4>
                <ul className="space-y-2 text-slate-500">
                  <li className="hover:text-blue-400 transition-colors cursor-pointer">Documentation</li>
                  <li className="hover:text-blue-400 transition-colors cursor-pointer">Changelog</li>
                  <li className="hover:text-blue-400 transition-colors cursor-pointer">Status</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} BackendCore Services. Built with Next.js 15.
            </p>
            <div className="flex items-center gap-4 text-slate-600 text-xs font-medium">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <div className="flex items-center gap-1 text-emerald-500/70">
                <Database className="w-3 h-3" />
                <span>DB Scale: OK</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

