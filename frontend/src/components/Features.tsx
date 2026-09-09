function Features() {
  const features = [
    {
      title: "AI Task Analysis",
      desc: "Understands context, urgency, and effort behind every task.",
    },
    {
      title: "Deadline Risk Prediction",
      desc: "Flags what's most likely to slip before it slips.",
    },
    {
      title: "AI Planner",
      desc: "Generates daily, weekly, and monthly plans you can actually execute.",
    },
    {
      title: "Focus Mode",
      desc: "Distraction-free sessions with AI nudges and microtasks.",
    },
    {
      title: "Goal Tracking",
      desc: "Long-term goals broken into milestones automatically.",
    },
    {
      title: "AI Assistant",
      desc: "Ask anything: Plan my week, Prioritize my list.",
    },
  ];

  return (
    <section
       id="features"
      className="features-section"
      style={{
        maxWidth: "1150px",
        margin: "80px auto",
        padding: "0 20px",
      }}
    >
      <p
        style={{
          color: "#8b5cf6",
          textAlign: "center",
          letterSpacing: "3px",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        FEATURES
      </p>

      <h2
        className="features-section__title"
        style={{
          textAlign: "center",
          fontSize: "44px",
          fontWeight: "700",
          marginTop: "12px",
          marginBottom: "15px",
          lineHeight: "1.2",
        }}
      >
        Everything your chief of staff would do.
      </h2>

      <p
        className="features-section__description"
        style={{
          textAlign: "center",
          color: "#94a3b8",
          marginBottom: "50px",
          fontSize: "17px",
        }}
      >
        Six AI-powered systems working together so nothing slips.
      </p>

      <div
        className="features-section__grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            style={{
              background: "#1e293b",
              padding: "28px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "0.3s",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "12px",
                fontWeight: "600",
              }}
            >
              {feature.title}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                fontSize: "15px",
              }}
            >
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
