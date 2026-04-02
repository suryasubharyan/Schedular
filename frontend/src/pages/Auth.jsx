import { useState, useContext } from "react";
import { register, login } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useContext(AuthContext); // ✅ context use
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await login({ email, password });
      } else {
        res = await register({ email, password, name });
      }
      console.log(res.data); // 🔍 debug
      
      if (res.data.success) {
        // ✅ context login (NOT localStorage directly)
        loginUser(res.data.token, res.data.user);
        alert(res.data.message);
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Toggle Buttons */}
        <div style={styles.toggle}>
          <button
            style={isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            style={!isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        <h2 style={styles.header}>
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* Input Fields Container */}
        <div style={styles.inputContainer}>
          {!isLogin && (
            <input
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : isLogin
            ? "Sign In"
            : "Create Account"}
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>

        <button
          style={styles.googleButton}
          onClick={() => alert("Google login coming soon!")}
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            style={{ width: "20px", height: "20px" }} 
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

// 🎨 UPDATED PREMIUM STYLES
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #111827 0%, #000000 100%)", // Richer dark background
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "#ffffff",
  },
  card: {
    width: "400px",
    padding: "40px",
    borderRadius: "24px",
    background: "linear-gradient(145deg, rgba(30, 30, 40, 0.8), rgba(15, 15, 20, 0.8))",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
    display: "flex",
    flexDirection: "column",
  },
  toggle: {
    display: "flex",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "14px",
    padding: "6px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  tab: {
    flex: 1,
    padding: "12px",
    background: "transparent",
    color: "#9ca3af",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeTab: {
    flex: 1,
    padding: "12px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)", // Modern Indigo
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
    transition: "all 0.3s ease",
  },
  header: {
    margin: "0 0 24px 0",
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px", // Replaces manual margins
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box", // Prevents padding from breaking width
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(0, 0, 0, 0.2)",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.3s ease",
  },
  button: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#ffffff",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
    transition: "all 0.2s ease",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255, 255, 255, 0.1)",
  },
  dividerText: {
    padding: "0 14px",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "600",
  },
  googleButton: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#374151",
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px", // Spacing between icon and text
    boxShadow: "0 4px 15px rgba(255, 255, 255, 0.05)",
  },
};