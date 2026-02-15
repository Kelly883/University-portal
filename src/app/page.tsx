import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, BookOpen, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent text-university-gold rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-university-gold/20">
            TU
          </div>
          <span className="font-heading text-xl uppercase tracking-widest text-accent dark:text-university-gold">Titan University</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <Link href="#" className="hover:text-accent dark:hover:text-university-gold transition-colors">Academics</Link>
          <Link href="#" className="hover:text-accent dark:hover:text-university-gold transition-colors">Admissions</Link>
          <Link href="#" className="hover:text-accent dark:hover:text-university-gold transition-colors">Research</Link>
          <Link href="#" className="hover:text-accent dark:hover:text-university-gold transition-colors">Campus Life</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="hidden sm:flex">Faculty Portal</Button>
          </Link>
          <Link href="/login">
            <Button className="shadow-lg shadow-university-gold/20">Student Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 academic-pattern opacity-[0.05] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-university-gold/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-university-gold/10 border border-university-gold/20 text-university-gold text-xs font-bold uppercase tracking-widest">
            Excellence Since 1985
          </div>
          <h1 className="text-5xl md:text-7xl font-heading uppercase tracking-tight text-accent dark:text-white mb-6 leading-tight">
            Forging the <span className="text-transparent bg-clip-text bg-gradient-to-r from-university-gold to-yellow-600">Future</span> <br/>
            of Innovation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Titan University empowers the next generation of leaders through world-class education, cutting-edge research, and a commitment to global impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-2">
              Explore Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-accent text-white py-16 border-y border-university-gold/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-heading text-university-gold mb-2">150+</div>
            <div className="text-sm uppercase tracking-widest text-slate-400">Degree Programs</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-heading text-university-gold mb-2">12:1</div>
            <div className="text-sm uppercase tracking-widest text-slate-400">Student-Faculty Ratio</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-heading text-university-gold mb-2">98%</div>
            <div className="text-sm uppercase tracking-widest text-slate-400">Employment Rate</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-heading text-university-gold mb-2">50k+</div>
            <div className="text-sm uppercase tracking-widest text-slate-400">Global Alumni</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading uppercase tracking-wide text-accent dark:text-white mb-4">Why Choose Titan?</h2>
            <div className="w-24 h-1 bg-university-gold mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#161B22] p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-heading uppercase tracking-wide mb-3 text-accent dark:text-white">World-Class Academics</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Learn from Nobel laureates and industry pioneers in state-of-the-art facilities designed for collaboration.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161B22] p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-heading uppercase tracking-wide mb-3 text-accent dark:text-white">Vibrant Community</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Join a diverse community of scholars from over 100 countries, united by a passion for discovery.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161B22] p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-university-gold/10 rounded-lg flex items-center justify-center mb-6 text-university-gold group-hover:scale-110 transition-transform">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-heading uppercase tracking-wide mb-3 text-accent dark:text-white">Career Success</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Our dedicated career center connects you with top employers, ensuring you're ready to lead from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-university-gold text-accent rounded-full flex items-center justify-center font-bold">TU</div>
              <span className="font-heading text-lg uppercase tracking-widest text-white">Titan University</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              123 University Avenue<br/>
              Titan City, TC 90210<br/>
              (555) 123-4567
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-university-gold transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-university-gold transition-colors">Admissions</Link></li>
              <li><Link href="#" className="hover:text-university-gold transition-colors">Campus Map</Link></li>
              <li><Link href="#" className="hover:text-university-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-university-gold transition-colors">Student Portal</Link></li>
              <li><Link href="/login" className="hover:text-university-gold transition-colors">Faculty Portal</Link></li>
              <li><Link href="#" className="hover:text-university-gold transition-colors">Library</Link></li>
              <li><Link href="#" className="hover:text-university-gold transition-colors">IT Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Titan University. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
