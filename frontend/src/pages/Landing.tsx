import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowitWorks from "../components/HowitWorks";
import Customers from "../components/Customers";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowitWorks />
      <Customers />
      <Pricing />
      <Footer />
    </>
  );
}

export default Landing;