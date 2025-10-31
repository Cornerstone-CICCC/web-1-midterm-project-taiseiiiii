"use client";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ParticleBackground from "./components/ParticleBackground";
import CursorTrail from "./components/CursorTrail";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Works from "./components/Works";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Blog from "./components/Blog";
import LoadingAnimation from "./components/LoadingAnimation";
import PixelPet from "./components/PixelPet";

export default function Home() {
  return (
    <>
      <LoadingAnimation />

      <ParticleBackground />
      <CursorTrail count={5} speed={0.25} size={12} maxOpacity={0.2} />

      <div className="relative z-10">
        <div className="container mx-auto px-6 lg:px-9 max-w-[1100px]">
          <Header />

          <main>
            <Hero />
            <Experience />
            <Skills />
            <Works />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
      <PixelPet
        spriteUrl="/slime-bounce.png"
        size={90}
        bounceHeight={12}
        isFixed={true}
        position={{ right: "20px", bottom: "20px" }}
      />
    </>
  );
}
