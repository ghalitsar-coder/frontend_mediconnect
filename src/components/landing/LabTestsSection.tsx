"use client";
import { Activity, Brain, Bone } from "lucide-react";

const labTests = [
  { icon: Bone, title: "Imaging tests", desc: "Advanced diagnostic imaging for accurate results", price: 120, original: 140, discount: 60 },
  { icon: Brain, title: "MRI & CT Scan", desc: "High-resolution brain and body scans", price: 120, original: 140, discount: 60 },
  { icon: Activity, title: "Orthopedists tests", desc: "Comprehensive bone and joint testing", price: 120, original: 140, discount: 60 },
];

const LabTestsSection = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-10">
        Frequently Book Lab Tests
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {labTests.map((t) => (
          <div key={t.title} className="rounded-3xl bg-card border border-border p-6 hover-lift cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-pastel-lavender flex items-center justify-center mb-5">
              <t.icon size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.desc}</p>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-foreground">${t.price}</span>
              <span className="text-sm text-muted-foreground line-through">${t.original}</span>
              <span className="px-2 py-0.5 rounded-full bg-pastel-peach text-xs font-bold text-foreground">{t.discount}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LabTestsSection;
