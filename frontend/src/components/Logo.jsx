import logoImg from "../assets/logo.png";

export default function Logo({ className = "h-10 w-10" }) {
  return <img src={logoImg} alt="Schedular" className={`shrink-0 object-contain ${className}`} />;
}
