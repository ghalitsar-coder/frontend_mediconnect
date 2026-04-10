"use client";
import { Apple, Play } from "lucide-react";
import appMockup from "@/assets/app-mockup.png";

const AppDownloadSection = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="rounded-3xl bg-navy text-primary-foreground p-10 lg:p-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="flex justify-center">
          {/* <img src={typeof appMockup === "string" ? appMockup : appMockup?.src || appMockup} alt="MediCare app mockup" className="w-64 lg:w-80 drop-shadow-2xl" loading="lazy" width={800} height={800} /> */}
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-5xl font-extrabold leading-tight">
            Download Our Healthcare App for Easy Access
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Get instant access to doctors, lab tests, medicines, and more — right from your phone.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card/10 border border-primary-foreground/20 hover:bg-card/20 transition-colors">
              <Apple size={24} />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider opacity-70">Download on the</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </button>
            <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card/10 border border-primary-foreground/20 hover:bg-card/20 transition-colors">
              <Play size={24} />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider opacity-70">GET IT ON</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
