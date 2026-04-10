"use client";
import { ArrowRight, Pill, Apple } from "lucide-react";

const BlogSection = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground">
          Read top articles from health experts
        </h2>
        <button className="group flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
          READ ALL BLOGS
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-pastel-yellow p-8 hover-lift cursor-pointer">
          <span className="inline-block px-3 py-1 rounded-full bg-card/60 text-xs font-semibold text-foreground mb-4">Blog Topic</span>
          <div className="w-14 h-14 rounded-2xl bg-card/60 flex items-center justify-center mb-6">
            <Pill size={28} strokeWidth={1.5} className="text-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground leading-snug">
            Acne Care Combo of Cetaphil Oily Skin Cleanse.
          </h3>
        </div>

        <div className="rounded-3xl bg-pastel-mint p-8 hover-lift cursor-pointer">
          <span className="inline-block px-3 py-1 rounded-full bg-card/60 text-xs font-semibold text-foreground mb-4">Healthy lifestyle</span>
          <div className="w-14 h-14 rounded-2xl bg-card/60 flex items-center justify-center mb-6">
            <Apple size={28} strokeWidth={1.5} className="text-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground leading-snug mb-6">
            Your Ultimate Guide to Health and Wellness
          </h3>
          <button className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Book Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
