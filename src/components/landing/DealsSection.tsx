"use client";
import { Star, Plus } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  { name: "Dietary Supplement", cat: "Nutrition", rating: 4.5, price: 64, original: 80, discount: "20% Off", img: product1 },
  { name: "Nitrile Disposable Gloves", cat: "Healthcare", rating: 4.5, price: 64, original: 80, discount: "50% Off", img: product2 },
  { name: "Women's Multi Vitamins", cat: "Medicine", rating: 4.5, price: 64, original: 80, discount: "20% Off", img: product3 },
  { name: "Antibacterial Liquid Hand Soap", cat: "Wellness", rating: 4.5, price: 64, original: 80, discount: "50% Off", img: product4 },
];

const DealsSection = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-10">
        Today's best deals for you!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.name} className="rounded-3xl bg-card border border-border overflow-hidden hover-lift cursor-pointer">
            <div className="relative h-48 bg-muted flex items-center justify-center p-4">
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pastel-peach text-xs font-bold text-foreground">{p.discount}</span>
              {/* TODO: change resource image */}
              {/* <img src={typeof p.img === "string" ? p.img : p.img?.src || p.img} alt={p.name} className="h-36 w-36 object-contain" loading="lazy" width={512} height={512} /> */}
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{p.cat}</p>
              <h4 className="font-bold text-foreground mb-2 text-sm leading-tight">{p.name}</h4>
              <div className="flex items-center gap-1 mb-3">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-foreground">{p.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">${p.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground line-through">${p.original.toFixed(2)}</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealsSection;
