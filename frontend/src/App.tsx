// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Features from "./components/Features";
// import HowitWorks from "./components/HowitWorks";
// import Customers from "./components/Customers";
// import Pricing from "./components/Pricing";
// import Footer from "./components/Footer";
// function App() {
//   return (
//     <>
//       <Navbar />
//       <Hero />
//       <Features />
//       <HowitWorks />
//       <Customers />
//       <Pricing />
//       <Footer />
//     </>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
