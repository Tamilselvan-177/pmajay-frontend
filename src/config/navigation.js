import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  ShieldCheck,
  MapPin,
  Users,
  Settings,
  ChevronDown,
  Building2,
  ClipboardList,
  BarChart3,
} from 'lucide-react';

export const officerNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/officer',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderOpen,
    children: [
      { id: 'my-projects', label: 'My Project Requests', path: '/officer' },
      { id: 'create-project', label: 'Create New Project', path: '/officer/submit-document' },
    ],
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: ShieldCheck,
    children: [
      { id: 'verification-list', label: 'Verification List', path: '/officer/verification' },
      { id: 'verification-map', label: 'Verification Map', path: '/officer/verification/map' },
    ],
  },
  {
    id: 'heatmap',
    label: 'Village Heatmap',
    icon: MapPin,
    path: '/officer',
    tab: 'heatmap',
  },
];

export const collectorNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/collector',
  },
  {
    id: 'projects',
    label: 'Project Requests',
    icon: FolderOpen,
    path: '/collector',
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: ShieldCheck,
    children: [
      { id: 'verification-page', label: 'Verification Page', path: '/collector/verification' },
      { id: 'district-map', label: 'District Map', path: '/collector/verification/map' },
    ],
  },
  {
    id: 'officers',
    label: 'Officers',
    icon: Users,
    path: '/collector',
  },
];

export const primeMinisterNavigation = [
  {
    id: 'dashboard',
    label: 'National Dashboard',
    icon: LayoutDashboard,
    path: '/primeminister',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/primeminister',
  },
  {
    id: 'overview',
    label: 'State Overview',
    icon: MapPin,
    path: '/primeminister',
  },
];
