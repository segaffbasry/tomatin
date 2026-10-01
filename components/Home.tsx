"use client";

import { Header } from "@/components/chrome";
import { Hero } from "@/components/Hero";
import { Loader } from "@/components/Loader";
import { usePageMotion } from "@/components/motion";
import { Origins } from "@/components/Origins";
import { Brands, Footer, Intro, News, Recommendations } from "@/components/sections";
import { Timeline } from "@/components/Timeline";

export function Home() {
  usePageMotion();
  return (
    <>
      <Loader />
      <Header />
      <main>
        <Hero />
        <Intro />
        <Origins />
        <Timeline />
        <Recommendations />
        <Brands />
        <News />
      </main>
      <Footer />
    </>
  );
}
