"use client";
import { Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const AnimatedNumber = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target * 10) / 10);
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
};

const ReviewsSection = () => {
  return (
    <section className="container mx-auto px-6 py-16 text-center">
      <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-6 max-w-3xl mx-auto">
        Our doctors and clinics have earned over 5,000+ reviews on Google!
      </h2>
      <div className="flex items-center justify-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={28}
            className={s <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/50 text-amber-400/50"}
          />
        ))}
      </div>
      <p className="text-4xl font-extrabold text-foreground mb-2">
        <AnimatedNumber target={4.6} />
      </p>
      <p className="text-muted-foreground">Average Google Rating is 4.6</p>
    </section>
  );
};

export default ReviewsSection;
