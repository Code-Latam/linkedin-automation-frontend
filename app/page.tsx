import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/howitworks";
import AICapabilities from "@/components/landing/aicapabilities";
import Pricing from "@/components/landing/pricing";
import Contact from "@/components/landing/contact";
import FAQ from "@/components/landing/faqs";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="w-full">
        <Navbar/>
        <Hero/>
        <Features/>
        <HowItWorks/>
        <AICapabilities/>
        <Pricing/>
        <Contact/>
        <FAQ/>
        <Footer/>
      </main>
    </div>
  );
}
