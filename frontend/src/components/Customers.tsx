function Customers() {
  const reviews = [
    {
      name: "Akshita R.",
      role: "CS Student, IIIT",
      review:
        "I went from missing 3 deadlines a month to zero. The risk alerts are scary accurate.",
      avatar: "A",
    },
    {
      name: "Marcus T.",
      role: "Founder, Loomstack",
      review:
        "Replaced 4 tools. LifeSaver just tells me what to do next.",
      avatar: "M",
    },
    {
      name: "Priya S.",
      role: "PM, Razorpay",
      review:
        "It feels like having a chief of staff in my pocket.",
      avatar: "P",
    },
  ];

  return (
    <section
      id="customers"
      className="customers-section"
      style={{
        maxWidth: "1200px",
        margin: "120px auto",
        padding: "0 20px",
      }}
    >
      <p
        style={{
          color: "#8b5cf6",
          textAlign: "center",
          letterSpacing: "2px",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        LOVED BY BUILDERS
      </p>

      <h2
        className="customers-section__title"
        style={{
          textAlign: "center",
          fontSize: "48px",
          fontWeight: "800",
          marginTop: "20px",
          marginBottom: "70px",
        }}
      >
        "I finally feel ahead of my work."
      </h2>

      <div
        className="customers-section__grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "25px",
        }}
      >
        {reviews.map((review) => (
          <div
            key={review.name}
            style={{
              background: "#1e293b",
              borderRadius: "22px",
              padding: "30px",
              border: "1px solid rgba(255,255,255,.06)",
            }}
          >
            <div
              style={{
                color: "#fbbf24",
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              ⭐⭐⭐⭐⭐
            </div>

            <p
              style={{
                color: "white",
                lineHeight: "1.8",
                marginBottom: "30px",
              }}
            >
              "{review.review}"
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#8b5cf6,#6366f1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "700",
                }}
              >
                {review.avatar}
              </div>

              <div>
                <h4>{review.name}</h4>

                <p
                  style={{
                    color: "#94a3b8",
                    marginTop: "4px",
                    fontSize: "14px",
                  }}
                >
                  {review.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Customers;
