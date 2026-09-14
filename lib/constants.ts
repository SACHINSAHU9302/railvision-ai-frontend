export const APP_CONFIG = {
  name: 'RailVision AI',
  tagline: 'AI Railway Navigation & Assistance System',
  fullTitle: 'AI Railway Navigation & Assistance System using Multi-Agent RAG',
  version: '1.0.0',
  helpline: '139',
  securityEmergency: '182',
};

export const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/navigation', label: 'Station Navigation', icon: 'Compass' },
  { href: '/facilities', label: 'Facility Finder', icon: 'MapPin' },
  { href: '/assistant', label: 'AI Assistant', icon: 'BotMessageSquare', badge: 'RAG' },
  { href: '/documents', label: 'Railway Rules & Docs', icon: 'BookOpen' },
  { href: '/complaints', label: 'Complaints & Help', icon: 'AlertTriangle' },
  { href: '/ticket-scanner', label: 'Ticket Scanner', icon: 'ScanLine' },
  { href: '/voice-assistant', label: 'Voice Assistant', icon: 'Mic' },
];

export const MOBILE_BOTTOM_NAV = [
  { href: '/dashboard', label: 'Home', icon: 'Home' },
  { href: '/navigation', label: 'Navigate', icon: 'Compass' },
  { href: '/assistant', label: 'AI Chat', icon: 'Sparkles', isPrimary: true },
  { href: '/complaints', label: 'Complaints', icon: 'AlertCircle' },
  { href: '/profile', label: 'Profile', icon: 'User' },
];

export const FACILITY_CATEGORIES = [
  { id: 'all', label: 'All Amenities', icon: 'LayoutGrid' },
  { id: 'waiting_room', label: 'Waiting Lounge', icon: 'Armchair' },
  { id: 'toilet', label: 'Restrooms', icon: 'Bath' },
  { id: 'atm', label: 'ATMs & Cash', icon: 'CreditCard' },
  { id: 'food', label: 'Food & Cafes', icon: 'UtensilsCrossed' },
  { id: 'medical', label: 'Medical Post', icon: 'HeartPulse' },
  { id: 'help_desk', label: 'Divyangjan & Help', icon: 'Accessibility' },
  { id: 'ticket_counter', label: 'Ticket Counters', icon: 'Ticket' },
];
