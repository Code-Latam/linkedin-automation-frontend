import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Pricing from "@/components/landing/pricing";
import Contact from "@/components/landing/contact";
import FAQ from "@/components/landing/faqs";
import Footer from "@/components/landing/footer";
import {MoreFeatures} from "@/components/landing/morefeatures";
import HowItWorks from "@/components/landing/howitworks";
import type {Metadata} from "next";
import {pagesMetaData} from "@/lib/metadata";

export const metadata:Metadata = pagesMetaData.home;

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="w-full">
        <Navbar/>
        <Hero/>
        <Features/>
        <MoreFeatures/>
        <HowItWorks/>
        <Pricing/>
        <Contact/>
        <FAQ/>
        <Footer/>
      </main>
    </div>
  );
}
