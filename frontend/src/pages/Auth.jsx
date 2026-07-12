import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Logo from "../components/Logo";
import { getErrorMessage } from "../utils/getErrorMessage";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);

  const { user, authReady, login, register, googleLogin } = useContext(AuthContext);
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || "/dashboard";

  useEffect(() => {
    if (authReady && user) {
      navigate(destination, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            await googleLogin(response.credential);
            showSuccess("Successfully logged in with Google!");
            navigate(destination);
          } catch (error) {
            showError(getErrorMessage(error));
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
  }, [googleLogin, navigate, destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      showError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        showSuccess("Login successful!");
        navigate(destination);
      } else {
        await register(email, password, name);
        showSuccess("Account created successfully. Please login.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-night-950 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-linear-to-br from-slate-900 via-brand-800 to-accent-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <span className="font-display text-xl font-semibold tracking-tight">Schedular</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            Plan once. <span className="italic">Publish everywhere.</span>
          </h1>
          <p className="mt-4 text-base text-brand-100">
            Compose posts, schedule them across LinkedIn and more, and keep every
            connected profile organized from a single, calm dashboard.
          </p>
        </div>

        <p className="relative z-10 text-sm text-brand-200">
          © {new Date().getFullYear()} Schedular. Built for creators and teams.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft transition-colors duration-300 dark:border-night-800 dark:bg-night-900 sm:p-10">
          <div className="mb-8 flex rounded-xl bg-slate-100 p-1 dark:bg-night-800">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                isLogin
                  ? "bg-white text-slate-900 shadow-sm dark:bg-night-950 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                !isLogin
                  ? "bg-white text-slate-900 shadow-sm dark:bg-night-950 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Signup
            </button>
          </div>

          <h2 className="font-display mb-6 text-center text-2xl font-semibold text-slate-900 dark:text-white">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none
                  transition-all duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100
                  dark:border-night-700 dark:bg-night-800 dark:text-white dark:focus:ring-brand-900/40"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none
                transition-all duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100
                dark:border-night-700 dark:bg-night-800 dark:text-white dark:focus:ring-brand-900/40"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none
                transition-all duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100
                dark:border-night-700 dark:bg-night-800 dark:text-white dark:focus:ring-brand-900/40"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-linear-to-r from-brand-600 to-accent-600 py-3.5 text-sm font-bold text-white shadow-soft transition-all
                duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed
                disabled:opacity-60 disabled:translate-y-0"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200 dark:bg-night-800" />
            <span className="text-xs font-medium text-slate-400">OR</span>
            <span className="h-px flex-1 bg-slate-200 dark:bg-night-800" />
          </div>

          {googleClientId ? (
            <div className="flex justify-center" ref={googleButtonRef} />
          ) : (
            <p className="text-center text-xs text-slate-400">
              Add <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-night-800">VITE_GOOGLE_CLIENT_ID</code> in
              frontend env to enable Google login.
            </p>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">
            <Link to="/" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
