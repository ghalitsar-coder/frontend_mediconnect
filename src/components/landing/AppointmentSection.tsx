"use client";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import doctor1 from "@/assets/doctor-1.png";
import doctor2 from "@/assets/doctor-2.png";
import doctor3 from "@/assets/doctor-3.png";
import doctor4 from "@/assets/doctor-4.png";

const specializations = [
  "Orthopedists", "Obesity", "Neck pain", "Neurology", "Headache", "Shoulder", "Eye care",
];

const doctors = [
  { name: "Dr. Sherry", spec: "Gynecologist", img: doctor1 },
  { name: "Dr. Pimple Popper", spec: "Psychiatrist", img: doctor2 },
  { name: "Dr. Sanjana Gupta", spec: "Neurosurgeon", img: doctor3 },
  { name: "Dr. Jen Gunter", spec: "Neurologist", img: doctor4 },
];

const AppointmentSection = () => {
  const [activeSpec, setActiveSpec] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-8 max-w-2xl">
        Book an appointment for an in-clinic consultation
      </h2>

      {/* Specialization pills */}
      <div className="flex flex-wrap gap-3 mb-10">
        {specializations.map((s, i) => (
          <button
            key={s}
            onClick={() => setActiveSpec(i)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              i === activeSpec
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Doctor carousel */}
      <div className="relative">
        <button onClick={() => scroll(-1)} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center hover:bg-muted transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
          {doctors.map((d) => (
            <div key={d.name} className="flex-shrink-0 w-64 rounded-3xl bg-card border border-border p-6 hover-lift cursor-pointer">
              <div className="w-full h-48 rounded-2xl bg-pastel-blue/50 overflow-hidden mb-4 flex items-end justify-center">
                {/* TODO: change resource image */}
                {/* <img src={typeof d.img === "string" ? d.img : d.img?.src || d.img} alt={d.name} className="w-40 h-40 object-cover object-top" loading="lazy" width={512} height={512} /> */}
              </div>
              <h4 className="font-bold text-foreground">{d.name}</h4>
              <p className="text-sm text-muted-foreground">{d.spec}</p>
            </div>
          ))}
        </div>
        <button onClick={() => scroll(1)} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center hover:bg-muted transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1 bg-muted rounded-full max-w-xs mx-auto">
        <div className="h-full w-1/3 bg-primary rounded-full transition-all" />
      </div>
    </section>
  );
};

export default AppointmentSection;
