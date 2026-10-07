"use client";

import { Header } from "@/components/chrome";
import { Hero } from "@/components/Hero";
import { Loader } from "@/components/Loader";
import { usePageMotion } from "@/components/motion";
import { BrandStage } from "@/components/BrandStage";
import { Chapters } from "@/components/Chapters";
import { Footer, News, Recommendations } from "@/components/sections";
import { Story } from "@/components/Story";

export function Home() {
  usePageMotion();
  return (
    <>
      <Loader />
      <Header />
      <main>
        <Hero />
        <Story />
        <Chapters />
        <Recommendations />
        <BrandStage />
        <News />
      </main>
      <Footer />
    </>
  );
}
