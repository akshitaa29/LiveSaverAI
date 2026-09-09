function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        color: "#94a3b8",
        padding: "32px 20px",
        textAlign: "center",
      }}
    >
      <p>© {new Date().getFullYear()} LifeSaver AI. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
