import { Link } from "react-router-dom";

function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020b24",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#111827",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "24px",
          padding: "45px",
          boxShadow: "0 0 40px rgba(139,92,246,.18)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "38px",
            marginBottom: "10px",
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          Login to continue using LifeSaver AI
        </p>

        <div style={{ marginBottom: "22px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "15px",
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "12px",
              color: "white",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "15px",
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "12px",
              color: "white",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            textAlign: "right",
            marginBottom: "30px",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#8b5cf6",
              textDecoration: "none",
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <button
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
            border: "none",
            borderRadius: "14px",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#94a3b8",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/"
            style={{
              color: "#8b5cf6",
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;