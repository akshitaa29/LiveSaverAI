function Footer() {
  return (
    <footer
      style={{
        marginTop: "120px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "35px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {/* Left */}

        <div
          style={{
            color: "#94a3b8",
            fontSize: "15px",
          }}
        >
          © {new Date().getFullYear()} LifeSaver AI. All rights reserved.
        </div>

        {/* Right */}

        <div
          style={{
            display: "flex",
            gap: "35px",
            flexWrap: "wrap",
          }}
        >
          {["Privacy", "Terms", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                transition: "0.3s",
                fontSize: "15px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;