import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Pricing from "@/components/landing/pricing";
import Contact from "@/components/landing/contact";
import FAQ from "@/components/landing/faqs";
import Footer from "@/components/landing/footer";
import RealChats from "@/components/landing/realchats";
import {MoreFeatures} from "@/components/landing/morefeatures";
import {Adapts} from "@/components/landing/adapts";
import HowItWorks from "@/components/landing/howitworks";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="w-full">
        <Navbar/>
        <Hero/>
        <Features/>
        <RealChats/>
        <MoreFeatures/>
        <Adapts/>
        <HowItWorks/>
        <Pricing/>
        <Contact/>
        <FAQ/>
        <Footer/>
      </main>
    </div>
  );
}
