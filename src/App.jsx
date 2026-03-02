import { useState, useEffect, useRef } from "react";
import { C } from "./constants";
import Navbar            from "./components/Navbar";
import HeroSection       from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ApiDocsSection    from "./components/ApiDocsSection";
import SchemaSection     from "./components/SchemaSection";
import TechStackSection  from "./components/TechStackSection";
import QuickStartSection from "./components/QuickStartSection";
import Footer            from "./components/Footer";

export default function App() {
  const [activeGroup, setActiveGroup] = useState("products");
  const [scrolled, setScrolled]       = useState(false);
  const docsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #111318; }
        ::-webkit-scrollbar-thumb { background: #2a2d38; border-radius: 3px; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow    { 0%,100% { opacity:.6; } 50% { opacity:1; } }
        @keyframes float   { 0%,100% { transform:translateY(-50%); } 50% { transform:translateY(calc(-50% - 8px)); } }
        .fade-up   { animation: fadeUp .7s both; }
        .fade-up-1 { animation: fadeUp .7s .1s both; }
        .fade-up-2 { animation: fadeUp .7s .2s both; }
        .fade-up-3 { animation: fadeUp .7s .3s both; }

        /* Terminal card: hidden by default, shown on wide screens */
        .terminal-float { display: none; }
        @media (min-width: 1100px) { .terminal-float { display: block; animation: float 4s ease-in-out infinite; } }

        /* Nav links: hidden on small screens */
        @media (max-width: 700px) { .nav-links { display: none !important; } }
      `}</style>

      <Navbar scrolled={scrolled} />
      <HeroSection onScrollToDocs={() => docsRef.current?.scrollIntoView({ behavior: "smooth" })} />
      <HowItWorksSection />
      <ApiDocsSection docsRef={docsRef} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />
      <SchemaSection />
      <TechStackSection />
      <QuickStartSection />
      <Footer />
    </div>
  );
}