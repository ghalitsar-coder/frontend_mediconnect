import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeatureCards from "@/components/landing/FeatureCards";
import FindFacilitySection from "@/components/landing/FindFacilitySection";
import SmartQueueSection from "@/components/landing/SmartQueueSection";
import AppointmentSection from "@/components/landing/AppointmentSection";
import LabTestsSection from "@/components/landing/LabTestsSection";
import DealsSection from "@/components/landing/DealsSection";
import MedicalRecordsSection from "@/components/landing/MedicalRecordsSection";
import LabResultsSection from "@/components/landing/LabResultsSection";
import AppDownloadSection from "@/components/landing/AppDownloadSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import BlogSection from "@/components/landing/BlogSection";
import Footer from "@/components/landing/Footer";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeatureCards />
      <ScrollReveal>
        <FindFacilitySection />
      </ScrollReveal>
      <ScrollReveal>
        <SmartQueueSection />
      </ScrollReveal>
      <ScrollReveal>
        <AppointmentSection />
      </ScrollReveal>
      <ScrollReveal>
        <MedicalRecordsSection />
      </ScrollReveal>
      <ScrollReveal>
        <LabResultsSection />
      </ScrollReveal>
      <ScrollReveal>
        <LabTestsSection />
      </ScrollReveal>
      <ScrollReveal>
        <DealsSection />
      </ScrollReveal>
      <ScrollReveal>
        <AppDownloadSection />
      </ScrollReveal>
      <ScrollReveal>
        <ReviewsSection />
      </ScrollReveal>
      <ScrollReveal>
        <TestimonialsSection />
      </ScrollReveal>
      <ScrollReveal>
        <BlogSection />
      </ScrollReveal>
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default Index;
