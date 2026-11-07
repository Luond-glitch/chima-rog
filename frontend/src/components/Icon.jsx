import {
  Trees, CloudSun, Sprout, HeartHandshake, Megaphone, Users, BookOpen, Droplets, MapPin, Heart,
  GraduationCap, Handshake, Link2, Leaf, Sun, Target, Eye, Sparkles, Mail, Phone, ArrowRight, Menu, X, ChevronDown, Calendar, Play, FileText, Image as ImageIcon,
  CheckCircle2, AlertCircle, Quote, Award, Globe, Shield, Lightbulb, Recycle,
} from 'lucide-react'

const MAP = {
  trees: Trees, 'cloud-sun': CloudSun, sprout: Sprout, 'heart-handshake': HeartHandshake, megaphone: Megaphone,
  users: Users, 'book-open': BookOpen, droplets: Droplets, 'map-pin': MapPin, heart: Heart,
  'graduation-cap': GraduationCap, handshake: Handshake, link: Link2, leaf: Leaf, sun: Sun, target: Target,
  eye: Eye, sparkles: Sparkles, mail: Mail, phone: Phone, arrow: ArrowRight, menu: Menu, x: X,
  chevron: ChevronDown, calendar: Calendar, play: Play, file: FileText, image: ImageIcon, check: CheckCircle2,
  alert: AlertCircle, quote: Quote, award: Award, globe: Globe, shield: Shield, lightbulb: Lightbulb, recycle: Recycle,
}
/** Brand glyphs (lucide v1 no longer ships brand logos), drawn as simple inline SVGs. */
const BRAND = {
  facebook: 'M14 8.5V6.9c0-.7.2-1.2 1.3-1.2H17V3h-2.5C11.8 3 10.6 4.6 10.6 6.7v1.8H8.5V11h2.1v10H14V11h2.5l.4-2.5H14z',
  twitter: 'M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.2L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.2 4.7H5.4l11.3 14.5z',
  instagram: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm4.9-2.5a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z',
  linkedin: 'M4.5 3a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM3 8.5h3V21H3V8.5zm5.5 0h2.9v1.7c.5-.9 1.7-2 3.6-2 3.4 0 4 2.2 4 5.1V21h-3v-6.7c0-1.6 0-3.3-2-3.3s-2.4 1.5-2.4 3.2V21h-3V8.5z',
  youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3L10 15z',
}

export const ICON_NAMES = Object.keys(MAP).filter((n) => !['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'menu', 'x', 'chevron', 'arrow', 'alert', 'check', 'quote'].includes(n))

export default function Icon({ name, className = 'h-5 w-5', ...rest }) {
  if (BRAND[name])
    return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" {...rest}><path d={BRAND[name]} /></svg>
  const C = MAP[name] || Leaf
  return <C className={className} aria-hidden="true" {...rest} />
}
