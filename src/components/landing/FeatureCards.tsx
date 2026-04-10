"use client";
import { Smartphone, Stethoscope, Pill, TestTube } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Instant Video Consultation",
    desc: "Connect within 60 secs",
    bg: "bg-pastel-yellow",
  },
  {
    icon: Stethoscope,
    title: "Find Doctors near you",
    desc: "Confirmed appointments",
    bg: "bg-pastel-mint",
  },
  {
    icon: Pill,
    title: "24/7 Medicines",
    desc: "Essentials at your doorstep",
    bg: "bg-pastel-pink",
  },
  {
    icon: TestTube,
    title: "Lab Tests",
    desc: "Sample pickup at your home",
    bg: "bg-pastel-blue",
  },
];

const FeatureCards = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`${f.bg} rounded-3xl p-8 hover-lift cursor-pointer opacity-0 animate-fade-in-up`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-14 h-14 rounded-2xl bg-card/60 flex items-center justify-center mb-6">
              <f.icon size={28} className="text-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-foreground/70">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
