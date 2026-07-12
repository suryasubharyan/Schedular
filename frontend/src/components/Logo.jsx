import logo from "../assets/logo.png";

export default function Logo({ className = "h-10 w-10" }) {
  return <img src={logo} alt="Schedular" className={`shrink-0 object-contain ${className}`} />;
}
