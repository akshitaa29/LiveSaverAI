function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        textAlign: "center",
        padding: "80px 20px",
        maxWidth: "1150px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 18px",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "999px",
          color: "#94a3b8",
          fontSize: "14px",
          marginBottom: "30px",
        }}
      >
        New · AI Deadline Risk Prediction is live
      </div>

      <h1
        className="hero-section__title"
        style={{
          fontSize: "58px",
          fontWeight: "800",
          lineHeight: "1.08",
          margin: 0,
        }}
      >
        Stop missing deadlines.
      </h1>

      <h1
        className="hero-section__title"
        style={{
          fontSize: "58px",
          fontWeight: "800",
          lineHeight: "1.08",
          marginTop: "10px",
          background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Let AI plan your success.
      </h1>

      <p
        className="hero-section__description"
        style={{
          maxWidth: "620px",
          margin: "25px auto",
          color: "#94a3b8",
          fontSize: "18px",
          lineHeight: "1.7",
        }}
      >
        LifeSaver AI predicts missed deadlines,
        organizes your schedule, and helps you
        take action before it's too late.
      </p>

      <div
        className="hero-section__actions"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "35px",
        }}
      >
        <button
          className="hero-section__button"
          style={{
            background:
              "linear-gradient(135deg,#8b5cf6,#6366f1)",
            border: "none",
            color: "white",
            padding: "16px 28px",
            borderRadius: "14px",
            fontSize: "17px",
            cursor: "pointer",
          }}
        >
          Get Started Free →
        </button>

        <button
          className="hero-section__button"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            padding: "16px 28px",
            borderRadius: "14px",
            fontSize: "17px",
            cursor: "pointer",
          }}
        >
          Watch Demo
        </button>
      </div>

      <p
        style={{
          color: "#94a3b8",
          marginTop: "20px",
          fontSize: "14px",
        }}
      >
        Free forever for solo · No credit card required
      </p>

      <div
        className="hero-section__dashboard"
        style={{
          marginTop: "50px",
          maxWidth: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
          border: "1px solid rgba(139,92,246,0.4)",
          borderRadius: "30px",
          padding: "20px",
          boxShadow: "0 0 40px rgba(139,92,246,0.3)",
          background: "#111827",
        }}
      >
        <div
          className="hero-section__dashboard-content"
          style={{
            background: "#0f172a",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <div
            className="hero-section__dashboard-top"
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              className="hero-section__score-card"
              style={{
                flex: 1,
                background: "#1e293b",
                borderRadius: "20px",
                padding: "25px",
              }}
            >
              <p style={{ color: "#94a3b8" }}>
                Productivity Score
              </p>

              <h2 style={{ fontSize: "42px" }}>
                87<span style={{ fontSize: "18px" }}>/100</span>
              </h2>

              <div
                style={{
                  height: "8px",
                  background: "#334155",
                  borderRadius: "999px",
                }}
              >
                <div
                  style={{
                    width: "87%",
                    height: "100%",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(90deg,#8b5cf6,#6366f1)",
                  }}
                />
              </div>
            </div>

            <div
              className="hero-section__briefing-card"
              style={{
                flex: 2,
                background: "#1e293b",
                borderRadius: "20px",
                padding: "25px",
                textAlign: "left",
              }}
            >
              <p style={{ color: "#a78bfa" }}>
                AI Briefing
              </p>

              <h3>
                Good evening, Akshita 👋
              </h3>

              <p style={{ color: "#cbd5e1" }}>
                Your top priority today is the Internship
                Application — risk is moderate.
              </p>
            </div>
          </div>

          <div
            className="hero-section__schedule"
            style={{
              background: "#1e293b",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <p style={{ color: "#94a3b8" }}>
              Today's Schedule
            </p>

            <div
              className="hero-section__schedule-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              {[
                "Resume",
                "Internship App",
                "DSA Practice",
                "Break",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "15px",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
