import {
  LayoutDashboard,
  FolderOpen,
  MapPin,
  Map,
  BarChart3,
} from 'lucide-react';

export const officerNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    tab: 'dashboard',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderOpen,
    tab: 'projects',
  },
  {
    id: 'heatmap',
    label: 'Heatmap',
    icon: Map,
    tab: 'heatmap',
  },
  {
    id: 'district-map',
    label: 'District Map',
    icon: MapPin,
    path: '/officer/verification/map',
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
    label: 'Projects',
    icon: FolderOpen,
    path: '/collector',
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: Map,
    path: '/collector/verification',
  },
  {
    id: 'district-map',
    label: 'District Map',
    icon: MapPin,
    path: '/collector/verification/map',
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
