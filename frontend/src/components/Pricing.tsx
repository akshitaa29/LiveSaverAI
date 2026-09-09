function Pricing() {
  return (
    <section
      id="pricing"
      className="pricing-section"
      style={{
        maxWidth: "1200px",
        margin: "120px auto",
        padding: "0 20px",
      }}
    >
      <div
        className="pricing-section__card"
        style={{
          background: "#1e293b",
          borderRadius: "28px",
          padding: "80px 40px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <h2
          className="pricing-section__title"
          style={{
            fontSize: "56px",
            fontWeight: "800",
          }}
        >
          Start saving your deadlines today.
        </h2>

        <p
          className="pricing-section__description"
          style={{
            color: "#94a3b8",
            fontSize: "22px",
            marginTop: "20px",
            lineHeight: "1.6",
          }}
        >
          Join 12,000+ students, founders and PMs
          running their lives with LifeSaver AI.
        </p>

        <div
          className="pricing-section__actions"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "45px",
          }}
        >
          <button
            className="pricing-section__button"
            style={{
              background:
                "linear-gradient(135deg,#8b5cf6,#6366f1)",
              border: "none",
              color: "white",
              padding: "18px 34px",
              borderRadius: "14px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Get Started Free →
          </button>

          <button
            className="pricing-section__button"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,.08)",
              color: "white",
              padding: "18px 34px",
              borderRadius: "14px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Talk to Sales
          </button>
        </div>

        <div
          className="pricing-section__benefits"
          style={{
            marginTop: "35px",
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            color: "#94a3b8",
          }}
        >
          <span>✅ No credit card</span>
          <span>✅ Cancel anytime</span>
          <span>✅ SOC 2 Ready</span>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
