function HowitWorks() {
  const steps = [
    {
      no: "01",
      title: "Add Your Tasks",
      desc: "Simply add assignments, meetings, projects and goals. LifeSaver AI keeps everything organized in one place.",
    },
    {
      no: "02",
      title: "AI Understands Priorities",
      desc: "Our AI analyzes urgency, deadlines and workload to determine what deserves your attention first.",
    },
    {
      no: "03",
      title: "Smart Daily Planning",
      desc: "Automatically generates an optimized schedule that balances productivity and prevents burnout.",
    },
    {
      no: "04",
      title: "Stay Ahead",
      desc: "Receive intelligent reminders, risk alerts and AI suggestions before deadlines become a problem.",
    },
  ];

  return (
    <section
      id="how"
      className="how-it-works-section"
      style={{
        maxWidth: "1200px",
        margin: "130px auto",
        padding: "0 20px",
      }}
    >
      <p
        style={{
          color: "#8b5cf6",
          textAlign: "center",
          letterSpacing: "2px",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        HOW IT WORKS
      </p>

      <h2
        className="how-it-works-section__title"
        style={{
          textAlign: "center",
          fontSize: "48px",
          fontWeight: "800",
          marginTop: "18px",
          marginBottom: "18px",
        }}
      >
        From chaos to clarity in
        <br />
        4 simple steps.
      </h2>

      <p
        className="how-it-works-section__description"
        style={{
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "18px",
          maxWidth: "700px",
          margin: "0 auto 70px",
          lineHeight: "1.7",
        }}
      >
        LifeSaver AI analyzes your work, predicts risks,
        creates your schedule and keeps you focused until
        every deadline is completed.
      </p>

      <div
        className="how-it-works-section__grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "25px",
        }}
      >
        {steps.map((step) => (
          <div
            key={step.no}
            style={{
              background: "#1e293b",
              padding: "35px",
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "0.35s",
              cursor: "pointer",
              boxShadow: "0 0 25px rgba(0,0,0,.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 15px 40px rgba(139,92,246,.25)";
              e.currentTarget.style.border =
                "1px solid rgba(139,92,246,.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow =
                "0 0 25px rgba(0,0,0,.25)";
              e.currentTarget.style.border =
                "1px solid rgba(255,255,255,0.06)";
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg,#8b5cf6,#6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "700",
                fontSize: "20px",
                marginBottom: "28px",
              }}
            >
              {step.no}
            </div>

            <h3
              style={{
                fontSize: "24px",
                marginBottom: "18px",
              }}
            >
              {step.title}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.8",
                fontSize: "16px",
              }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowitWorks;
