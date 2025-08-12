import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faClock,
  faHeart,
  faCheck,
  faTimes,
  faQuestion,
  faSpinner,
  faSearch,
  faEnvelope,
  faPhone,
  faGlobe,
  faShare,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faFacebook,
  faInstagram,
  faTwitter,
  faWaze,
} from "@fortawesome/free-brands-svg-icons";

// Icon mapping for better tree-shaking
const iconMap = {
  calendar: faCalendarAlt,
  location: faMapMarkerAlt,
  clock: faClock,
  heart: faHeart,
  check: faCheck,
  times: faTimes,
  question: faQuestion,
  spinner: faSpinner,
  search: faSearch,
  envelope: faEnvelope,
  phone: faPhone,
  globe: faGlobe,
  share: faShare,
  download: faDownload,
  whatsapp: faWhatsapp,
  facebook: faFacebook,
  instagram: faInstagram,
  twitter: faTwitter,
  waze: faWaze,
} as const;

type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
  size?: "xs" | "sm" | "lg" | "1x" | "2x" | "3x";
}

export default function Icon({ name, className = "", size = "1x" }: IconProps) {
  return (
    <FontAwesomeIcon icon={iconMap[name]} className={className} size={size} />
  );
}
