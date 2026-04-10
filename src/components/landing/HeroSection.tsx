"use client";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import doctorHero from "@/assets/doctor-hero.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-navy text-primary-foreground">
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div className="space-y-8 z-10">
            <h1 className="text-6xl lg:text-8xl xl:text-9xl font-extrabold leading-none tracking-tight opacity-0 animate-fade-in-up">
              Healthcare
            </h1>
            <div className="space-y-3">
              <div className="flex items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="w-6 h-6 rounded-full bg-pastel-mint flex items-center justify-center">
                  <Check size={14} className="text-navy" />
                </div>
                <span className="text-lg">Reduce HbA1c</span>
              </div>
              <div className="flex items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <div className="w-6 h-6 rounded-full bg-pastel-yellow flex items-center justify-center">
                  <Check size={14} className="text-navy" />
                </div>
                <span className="text-lg">No more medications</span>
              </div>
            </div>
            <p className="text-sm uppercase tracking-wider text-primary-foreground/60 max-w-xs leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              If you're looking for a creative and easy way to build a website, wow! is the perfect solution.
            </p>
          </div>

          {/* Right - Doctor */}
          <div className="relative flex justify-center lg:justify-end">
            {/* TODO: change resource image */}
            {/* <img
              src={typeof doctorHero === "string" ? doctorHero : doctorHero?.src || doctorHero}
              alt="Friendly doctor with stethoscope"
              className="relative z-10 w-72 lg:w-96 drop-shadow-2xl"
              width={600}
              height={800}
            /> */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-pastel-mint/10 blur-3xl" />
          </div>
        </div>

        {/* Book Consultation Button */}
        <div className="mt-8 flex justify-end opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <Link href="/booking" className="group flex items-center gap-3 px-8 py-4 rounded-full bg-pastel-mint text-navy font-semibold text-lg hover-lift">
            Book Consultation
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
