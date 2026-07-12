import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  IoAddOutline,
  IoBarChartOutline,
  IoBulbOutline,
  IoCalendarOutline,
  IoChevronDown,
  IoClose,
  IoDocumentTextOutline,
  IoHelpCircleOutline,
  IoLinkOutline,
  IoMenuOutline,
  IoMoonOutline,
  IoPaperPlaneOutline,
  IoSettingsOutline,
  IoShieldCheckmarkOutline,
  IoStar,
  IoSunnyOutline,
} from "react-icons/io5";

export const LinkedInIcon = ({ className = "h-10 w-10" }) => (
  <div className={`grid shrink-0 place-items-center rounded-[22%] bg-[#0A66C2] text-white ${className}`}>
    <FaLinkedinIn className="h-[55%] w-[55%]" />
  </div>
);

export const FacebookIcon = ({ className = "h-10 w-10" }) => (
  <div className={`grid shrink-0 place-items-center rounded-[22%] bg-[#1877F2] text-white ${className}`}>
    <FaFacebookF className="h-[45%] w-[45%]" />
  </div>
);

export const InstagramIcon = ({ className = "h-10 w-10" }) => (
  <div
    className={`grid shrink-0 place-items-center rounded-[22%] text-white ${className}`}
    style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)" }}
  >
    <FaInstagram className="h-[60%] w-[60%]" />
  </div>
);

export const TwitterIcon = ({ className = "h-10 w-10" }) => (
  <div className={`grid shrink-0 place-items-center rounded-[22%] bg-black text-white ${className}`}>
    <FaXTwitter className="h-[50%] w-[50%]" />
  </div>
);

export const CalendarIcon = ({ className }) => <IoCalendarOutline className={className} />;

export const ChartIcon = ({ className }) => <IoBarChartOutline className={className} />;

export const ChevronDownIcon = ({ className }) => <IoChevronDown className={className} />;

export const HelpIcon = ({ className }) => <IoHelpCircleOutline className={className} />;

export const MenuIcon = ({ className }) => <IoMenuOutline className={className} />;

export const MoonIcon = ({ className }) => <IoMoonOutline className={className} />;

export const PlatformsIcon = ({ className }) => <IoLinkOutline className={className} />;

export const PlusIcon = ({ className }) => <IoAddOutline className={className} />;

export const PostsIcon = ({ className }) => <IoDocumentTextOutline className={className} />;

export const SettingsIcon = ({ className }) => <IoSettingsOutline className={className} />;

export const LightbulbIcon = ({ className }) => <IoBulbOutline className={className} />;

export const SendIcon = ({ className }) => <IoPaperPlaneOutline className={className} />;

export const ShieldIcon = ({ className }) => <IoShieldCheckmarkOutline className={className} />;

export const StarIcon = ({ className }) => <IoStar className={className} />;

export const SunIcon = ({ className }) => <IoSunnyOutline className={className} />;

export const XIcon = ({ className }) => <IoClose className={className} />;
