"use client";

import { Header } from "@/components/chrome";
import { Hero } from "@/components/Hero";
import { Loader } from "@/components/Loader";
import { usePageMotion } from "@/components/motion";
import { Brands, Footer, Intro, News, Recommendations, Timeline } from "@/components/sections";

export function Home() {
  usePageMotion();
  return (
    <>
      <Loader />
      <Header />
      <main>
        <Hero />
        <Intro />
        <Timeline />
        <Brands />
        <Recommendations />
        <News />
      </main>
      <Footer />
    </>
  );
}
