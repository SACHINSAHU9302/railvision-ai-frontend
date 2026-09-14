import Link from 'next/link';
import {
  Train,
  Bot,
  Compass,
  MapPin,
  ScanLine,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mic,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-100 selection:bg-[#0B2545] selection:text-white">
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B2545] text-white shadow-xs dark:bg-blue-600">
              <Train className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-slate-900 dark:text-slate-100 text-base">
                RailVision AI
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Multi-Agent RAG Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              How It Works
            </a>
            <a href="#ai-assistant" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              AI Assistant
            </a>
            <a href="#navigation-preview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Station Maps
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm" className="gap-1.5">
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 border-b border-slate-200/80 dark:border-slate-800 bg-linear-to-b from-blue-50/40 to-transparent dark:from-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-[#0B2545] dark:text-blue-300 text-xs font-semibold mb-6 border border-blue-200 dark:border-blue-900">
            <Zap className="w-3.5 h-3.5" />
            <span>Next-Generation Multi-Agent RAG for Indian Railways</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Your Intelligent <br className="hidden sm:inline" />
            <span className="text-[#0B2545] dark:text-blue-400">Railway Companion</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Navigate stations, discover facilities, understand railway information,
            and get intelligent assistance from one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-semibold shadow-md">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm font-semibold">
                Explore Features
              </Button>
            </a>
          </div>

          {/* Key Architecture Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Multi-Agent RAG Pipeline
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Accurate Platform Schematics
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Official Rules &amp; Documents
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Accessible Navigation
            </span>
          </div>
        </div>
      </section>

      {/* 3. Quick Actions Banner */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center mb-4">
            Direct Station Services
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Find Platform', icon: Compass, href: '/navigation' },
              { label: 'Find Facility', icon: MapPin, href: '/facilities' },
              { label: 'Ask AI Agent', icon: Bot, href: '/assistant' },
              { label: 'Scan Ticket', icon: ScanLine, href: '/ticket-scanner' },
              { label: 'Railway Rules', icon: BookOpen, href: '/documents' },
              { label: 'Voice Command', icon: Mic, href: '/voice-assistant' },
            ].map((qa, i) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={i}
                  href={qa.href}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-all text-center group"
                >
                  <Icon className="w-5 h-5 text-[#0B2545] dark:text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {qa.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Core Features */}
      <section id="features" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Engineered For Modern Travel
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Intelligent Guidance at Every Step of the Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Engineered to replace fragmented information with unified, verified railway navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-[#0B2545] dark:text-blue-400 mb-4 border border-blue-100 dark:border-blue-900">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Station Platform Schematics
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore platform layouts, foot-over-bridges, lifts, and escalators with clear accessibility markers designed for rapid boarding.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-[#0B2545] dark:text-blue-400 mb-4 border border-blue-100 dark:border-blue-900">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Multi-Agent RAG Assistant
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask natural questions about train rules, refund calculations, and amenities. Answers cite verified railway documents.
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-[#0B2545] dark:text-blue-400 mb-4 border border-blue-100 dark:border-blue-900">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Precise Facility Finder
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Locate executive lounges, ATMs, accessible restrooms, medical first aid posts, and food plazas sorted by proximity.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-16 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Clear Pipeline
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              How RailVision AI Operates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                1
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Query or Station Select
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose your destination station or ask the assistant any passenger question via text or voice.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                2
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Multi-Agent Coordination
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Navigation, Document, and Facility agents cross-reference official circulars and station coordinates.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                3
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                Actionable Passenger Direction
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Receive platform maps, direct distance estimates, document citations, and 1-click grievance logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI Assistant Star Feature Preview */}
      <section id="ai-assistant" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#0B2545] dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200 dark:border-blue-900">
              <Bot className="w-3.5 h-3.5" />
              <span>Multi-Agent RAG Grounded Intelligence</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
              Instant Answers with Document Citations
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Unlike generic chatbots, the RailVision Assistant cites verified railway rules—such as Tatkal booking windows, TDR cancellation time limits, and excess baggage weight allowances.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="font-semibold">Source Transparency:</strong> Every answer links to relevant railway circular sections.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="font-semibold">Context-Aware Actions:</strong> Generates direct links to station maps and grievance tracking.
                </p>
              </div>
            </div>
            <Link href="/assistant">
              <Button size="md" className="gap-2">
                <span>Try the AI Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Chat Mockup Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#0B2545] text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">RailVision Assistant</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">● Grounded in Railway Circulars</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">CC-34 / RAG Index</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-slate-800 dark:text-slate-200 max-w-[85%] ml-auto">
                What is the refund rule if my train is delayed by more than 3 hours?
              </div>
              <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 p-3 rounded-lg text-slate-800 dark:text-slate-200 max-w-[92%]">
                <p className="font-medium text-[#0B2545] dark:text-blue-300 mb-1">
                  Full Fare Refund with Zero Deduction:
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Under IR rules, if a train is delayed &gt;3 hours from originating or boarding station and the passenger chooses not to travel, full refund is granted with no clerkage charges upon filing TDR before departure.
                </p>
                <div className="mt-2 pt-2 border-t border-blue-200/50 dark:border-blue-900/50 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    Source: Refund &amp; Cancellation Guidelines
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Read Doc →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Navigation Preview */}
      <section id="navigation-preview" className="py-16 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Station Navigation
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Interactive Platform Schematics
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Clear orientation with elevator, escalator, and footbridge locations for major hubs like NDLS, CSMT, and HWH.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi', platforms: 16, id: 'ndls' },
              { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', platforms: 18, id: 'csmt' },
              { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', platforms: 23, id: 'hwh' },
            ].map((stn) => (
              <Card key={stn.id} className="p-5 flex flex-col justify-between hover:border-slate-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 text-xs font-bold font-mono bg-blue-100 text-[#0B2545] dark:bg-blue-950 dark:text-blue-300 rounded">
                      {stn.code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{stn.platforms} Platforms</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {stn.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{stn.city}</p>
                </div>
                <Link href={`/navigation/${stn.id}`}>
                  <Button variant="secondary" size="sm" className="w-full justify-between">
                    <span>View Platform Layout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Benefits */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="p-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Reduced Boarding Anxiety
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Know your platform number, nearest footbridge, and escalator before stepping onto the concourse.
            </p>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Accessibility-First
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dedicated filtering for wheelchair ramps, braille assistance, and battery-operated car reservations.
            </p>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Verified Passenger Rights
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              RAG engine indexes official railway board commercial circulars with exact fee calculation slabs.
            </p>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Transparent Grievances
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Log cleanliness or electrical complaints with platform accuracy and follow step-by-step resolution logs.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-16 sm:py-20 bg-[#0B2545] text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
            Experience Intelligent Railway Assistance Today
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">
            Ready to explore station layouts, query railway guidelines, and discover station facilities in one cohesive interface.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-[#0B2545] hover:bg-slate-100 font-semibold shadow-md">
                Launch RailVision App
              </Button>
            </Link>
            <Link href="/navigation" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-400 text-white hover:bg-blue-900/50">
                Explore Station Navigation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="py-8 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-white">RailVision AI</span>
            <span>•</span>
            <span>Frontend Architecture for AI Railway Navigation</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/assistant" className="hover:text-white transition-colors">AI Assistant</Link>
            <Link href="/documents" className="hover:text-white transition-colors">Documents</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
