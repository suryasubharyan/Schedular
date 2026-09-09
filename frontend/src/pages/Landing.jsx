import { useTheme } from "../hooks/useTheme";
import AmbientBackground from "../components/landing/AmbientBackground";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <AmbientBackground isDark={isDark} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
