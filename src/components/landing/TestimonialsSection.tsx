"use client";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Esther Howard",
    role: "Patient",
    comment: "I had a great experience at this healthcare clinic. I was seen quickly, and the doctor was able to diagnose and treat my condition.",
    rating: 5,
  },
  {
    name: "Cameron Williams",
    role: "Patient",
    comment: "Wonderful staff and very professional service. The online booking was seamless and the follow-up care was exceptional.",
    rating: 5,
  },
  {
    name: "Brooklyn Simmons",
    role: "Patient",
    comment: "The telemedicine consultation was incredibly convenient. Got my prescription within minutes and felt truly cared for.",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth">
        {testimonials.map((t) => (
          <div key={t.name} className="flex-shrink-0 w-80 rounded-3xl bg-card border border-border p-8 hover-lift">
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted"} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{t.comment}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pastel-mint flex items-center justify-center text-foreground font-bold text-sm">
                {t.name[0]}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 h-1 bg-muted rounded-full max-w-xs mx-auto">
        <div className="h-full w-2/3 bg-primary rounded-full transition-all" />
      </div>
    </section>
  );
};

export default TestimonialsSection;
