"use client";
import { Apple, Play } from "lucide-react";
import { Globe as Instagram, Globe as Twitter, Globe as Facebook } from "lucide-react";

const footerLinks = {
  Company: ["What's New", "About", "Press", "Careers", "Social Good", "Contact"],
  Community: ["MediCare for Business", "2022 Creator Report", "Charities", "Creator Profile Directory", "Explore Templates"],
  Support: ["Help Topics", "Getting Started", "Linktree Pro", "Features & How-Tos", "FAQs", "Report a Violation"],
  "Trust & Legal": ["Terms & Conditions", "Privacy Notice", "Cookie Notice", "Trust Center", "Cookie Preferences"],
};

const Footer = () => {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-full bg-pastel-mint flex items-center justify-center">
            <span className="text-navy font-bold text-lg">M</span>
          </div>
          <span className="text-2xl font-bold">MediCare</span>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="font-bold mb-4 text-sm">{cat}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-primary-foreground/20 hover:bg-card/10 transition-colors text-sm">
              <Apple size={18} /> App Store
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-primary-foreground/20 hover:bg-card/10 transition-colors text-sm">
              <Play size={18} /> Google Play
            </button>
          </div>

          <div className="flex items-center gap-4">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-primary-foreground/40">
          <p>© 2022 MediCare</p>
          <p>Design & Developed by MUSEMIND</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
