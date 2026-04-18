import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin, login, register } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);

  const { user, authReady, loginUser } = useContext(AuthContext);
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (authReady && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [authReady, navigate, user]);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    let isMounted = true;
    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');

    const renderGoogleButton = async () => {
      if (!window.google?.accounts?.id || !isMounted) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response.credential) {
            showError("Google login failed");
            return;
          }

          setLoading(true);

          try {
            const res = await googleLogin(response.credential);
            loginUser(res.data.token, res.data.user);
            showSuccess("Successfully logged in with Google!");
            navigate("/dashboard");
          } catch (error) {
            showError(error.response?.data?.error || "Google login failed");
          } finally {
            setLoading(false);
          }
        },
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "filled_white",
        size: "large",
        type: "standard",
        shape: "pill",
        text: "continue_with",
        width: 320,
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      script = script || document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;

      if (!document.body.contains(script)) {
        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [loginUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      showError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = isLogin
        ? await login({ email, password })
        : await register({ email, password, name });

      if (res.data.success) {
        loginUser(res.data.token, res.data.user);
        showSuccess(isLogin ? "Login successful!" : "Account created successfully!");
        navigate("/dashboard");
      } else {
        showError(res.data.message || "Something went wrong");
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.toggle}>
          <button
            type="button"
            style={isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            style={!isLogin ? styles.activeTab : styles.tab}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        <h2 style={styles.header}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>

        {googleClientId ? (
          <div style={styles.googleWrapper}>
            <div ref={googleButtonRef} />
          </div>
        ) : (
          <p style={styles.googleHelp}>
            Add <code>VITE_GOOGLE_CLIENT_ID</code> in frontend env to enable Google login.
          </p>
        )}
      </div>
    </div>
  );
}



const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    fontFamily: "'Inter', sans-serif",
    color: "#111",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    borderRadius: "20px",
    background: "#ffffff",
    border: "1px solid #e5e5e5",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },

  toggle: {
    display: "flex",
    background: "#f1f1f1",
    borderRadius: "12px",
    padding: "4px",
    marginBottom: "24px",
  },

  tab: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    color: "#666",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  activeTab: {
    flex: 1,
    padding: "10px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "700",
  },

  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginBottom: "25px",
  },

  inputGroup: {
    position: "relative",
  },

  input: {
    width: "100%",
    padding: "16px 12px 6px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: "14px",
    outline: "none",
  },

  label: {
    position: "absolute",
    left: "12px",
    top: "12px",
    fontSize: "13px",
    color: "#6b7280",
    background: "#fff",
    padding: "0 4px",
    transition: "0.2s ease",
    pointerEvents: "none",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    background: "#111",
    color: "#fff",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "25px 0",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e5e5e5",
  },

  dividerText: {
    padding: "0 10px",
    fontSize: "12px",
    color: "#777",
  },

  googleWrapper: {
    display: "flex",
    justifyContent: "center",
  },
};






