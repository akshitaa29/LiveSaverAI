import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="navbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#081227",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="navbar__inner"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "18px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          className="navbar__brand"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 700,
            fontSize: "22px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg,#8b5cf6,#6366f1)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Sparkles size={18} />
          </div>

          <span>LifeSaver AI</span>
        </div>

        <nav
          className={`navbar__links ${mobileMenuOpen ? "navbar__links--open" : ""}`}
          style={{
            display: "flex",
            gap: "40px",
            color: "#94a3b8",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <a href="#features">Features</a>
          <a href="#how">How it Works</a>
          <a href="#customers">Customers</a>
          <a href="#pricing">Pricing</a>

          <div className="navbar__mobile-actions">
            <button className="navbar__sign-in">Sign In</button>
            <button className="navbar__get-started">Get Started</button>
          </div>
        </nav>

        <div
          className="navbar__actions"
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <button
            className="navbar__sign-in"
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>

          <button
            className="navbar__get-started"
            style={{
              background:
                "linear-gradient(135deg,#8b5cf6,#6366f1)",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
