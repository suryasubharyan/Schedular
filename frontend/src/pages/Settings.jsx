import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import UserAvatar from "../components/UserAvatar";
import { useTheme } from "../context/ThemeContext";
import { useSocialData } from "../context/SocialDataContext";
import { useNotification } from "../context/NotificationContext";
import useAuth from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";
import { MoonIcon, SunIcon, PlatformsIcon } from "../components/Icons";

const emptyForm = {
  name: "",
  email: "",
  headline: "",
  profilePicture: "",
};

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { accounts } = useSocialData();
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      headline: user.headline || "",
      profilePicture: user.profilePicture || "",
    });
  }, [user]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
    event.target.value = null;
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, profilePicture: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const res = await updateUser(form);
      showSuccess(res.data.message || "Profile updated successfully");
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const connectedCount = accounts.filter((a) => a.connected).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Preferences
          </p>
          <h1 className="font-display mt-1 text-3xl font-semibold text-slate-900 dark:text-white">Settings</h1>
        </div>

        <div className="grid gap-6">
          <Card index={0} className="p-6 sm:p-7">
            <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">Edit profile</h2>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Update the details other people see when you're mentioned or connected.
            </p>

            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
              <div className="flex flex-col items-center gap-3">
                <UserAvatar
                  user={form}
                  className="h-28 w-28 border-4 border-brand-200 dark:border-brand-800"
                  textClassName="text-2xl"
                />
                <label
                  className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold
                    text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100
                    dark:border-night-700 dark:bg-night-800 dark:text-slate-200 dark:hover:bg-night-700"
                >
                  Upload photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {form.profilePicture && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400"
                  >
                    Remove photo
                  </button>
                )}
              </div>

              <div className="grid gap-4.5">
                <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                  Full name
                  <input
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Your full name"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none
                      transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100
                      dark:border-night-700 dark:bg-night-800 dark:text-white dark:focus:ring-brand-900/40"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="you@example.com"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none
                      transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100
                      dark:border-night-700 dark:bg-night-800 dark:text-white dark:focus:ring-brand-900/40"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                  Headline
                  <input
                    value={form.headline}
                    onChange={handleChange("headline")}
                    placeholder="Social media manager | Building thoughtful content"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none
                      transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100
                      dark:border-night-700 dark:bg-night-800 dark:text-white dark:focus:ring-brand-900/40"
                  />
                </label>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} className="min-w-40">
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          <Card index={1} className="p-6 sm:p-7">
            <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Switch between light and dark themes. Your choice is saved on this device.
            </p>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4
                transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 dark:border-night-700 dark:bg-night-800 dark:hover:bg-night-700"
            >
              <span className="flex items-center gap-3 font-semibold text-slate-800 dark:text-slate-100">
                {theme === "dark" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>
              <span className="rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white">
                Switch to {theme === "dark" ? "light" : "dark"}
              </span>
            </button>
          </Card>

          <Card index={2} className="p-6 sm:p-7">
            <Link
              to="/platforms"
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4
                transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 dark:border-night-700 dark:bg-night-800 dark:hover:bg-night-700"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  <PlatformsIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-800 dark:text-slate-100">Connected platforms</span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400">
                    {connectedCount} of {accounts.length || 4} connected — manage in Platforms
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-sm font-bold text-brand-600 dark:text-brand-400">Manage →</span>
            </Link>
          </Card>

          <Card index={3} className="p-6 sm:p-7">
            <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">Account</h2>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Signed in as {user?.email}
            </p>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
