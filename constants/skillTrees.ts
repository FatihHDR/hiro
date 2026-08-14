import { BadgeColor } from '../components/ui';

export type SkillBranchId = 'hvac' | 'cyber' | 'mechanical' | 'electrical';

export interface SkillNode {
  id: string;
  branch: SkillBranchId;
  name: string;
  titleIndo: string;
  tier: 1 | 2 | 3;
  xpCost: number;
  levelRequired: number;
  prerequisiteId: string | null;
  icon: string;
  accent: BadgeColor;
  summary: string;
  tacticalPerks: string[];
  unlockedContracts: string[];
}

export interface SkillBranch {
  id: SkillBranchId;
  name: string;
  subtitle: string;
  accent: BadgeColor;
  icon: string;
  description: string;
  nodes: SkillNode[];
}

export const SKILL_BRANCHES: SkillBranch[] = [
  {
    id: 'hvac',
    name: 'HVAC & THERMAL DYNAMICS',
    subtitle: 'Teknisi AC Dasar ➔ Spesialis Pendingin Komersial/Pusat',
    accent: 'crimson',
    icon: 'snow-outline',
    description: 'Jalur spesialisasi sistem pendingin udara mulai dari unit split perumahan hingga chiller industri berdaya megawatt.',
    nodes: [
      {
        id: 'hvac_1',
        branch: 'hvac',
        name: 'Basic AC Technician',
        titleIndo: 'Teknisi AC Dasar',
        tier: 1,
        xpCost: 0, // baseline unlocked
        levelRequired: 1,
        prerequisiteId: null,
        icon: 'thermometer-outline',
        accent: 'cyan',
        summary: 'Pemeriksaan freon, pembersihan filter, dan perbaikan kelistrikan AC split standar perumahan.',
        tacticalPerks: ['Akses Misi Residential Split AC', '+5% Akurasi Diagnostik Freon'],
        unlockedContracts: ['Pembersihan & Cuci AC Rumah', 'Isi Freon R32/R410A'],
      },
      {
        id: 'hvac_2',
        branch: 'hvac',
        name: 'Commercial VRF / Multi-Split Specialist',
        titleIndo: 'Spesialis Pendingin Komersial / VRF',
        tier: 2,
        xpCost: 1200,
        levelRequired: 5,
        prerequisiteId: 'hvac_1',
        icon: 'business-outline',
        accent: 'amber',
        summary: 'Instalasi, kalibrasi ducting, dan manajemen aliran refrigeran pada sistem AC gedung perkantoran multi-split.',
        tacticalPerks: ['Akses Misi Komersial Perkantoran', '+15% Escrow Reward Multiplier', 'Membuka Hak Bimbingan 1 Sidekick'],
        unlockedContracts: ['Overhaul AC Sentral Perkantoran', 'Kalibrasi Multi-Split Gedung Menara B'],
      },
      {
        id: 'hvac_3',
        branch: 'hvac',
        name: 'Industrial Chiller & Cryo Master',
        titleIndo: 'Master Chiller & Cold Storage Industri',
        tier: 3,
        xpCost: 2500,
        levelRequired: 12,
        prerequisiteId: 'hvac_2',
        icon: 'flame-outline',
        accent: 'crimson',
        summary: 'Pemeliharaan berat chiller amonia, evaporator turbin, dan pusat logistik pendingin rantai beku berskala industri.',
        tacticalPerks: ['Akses Misi Eksklusif Korporat Tier-A (Rp 1.5M+)', '+25% Hero Coins Bonus', 'Gelar Pangkat: Master Thermal Operator'],
        unlockedContracts: ['Overhaul Chiller Logistik Cold Storage 5MW', 'Emergency Compressor Rebuild Pelabuhan'],
      },
    ],
  },
  {
    id: 'cyber',
    name: 'CYBERSECURITY & IT INFRASTRUCTURE',
    subtitle: 'Teknisi IT Dasar ➔ Cybersecurity Specialist',
    accent: 'cyan',
    icon: 'shield-checkmark-outline',
    description: 'Jalur spesialisasi infrastruktur jaringan data, server array, dan mitigasi ancaman siber perbankan/korporat.',
    nodes: [
      {
        id: 'cyber_1',
        branch: 'cyber',
        name: 'Basic IT & Hardware Technician',
        titleIndo: 'Teknisi IT & Hardware Dasar',
        tier: 1,
        xpCost: 0,
        levelRequired: 1,
        prerequisiteId: null,
        icon: 'hardware-chip-outline',
        accent: 'cyan',
        summary: 'Troubleshooting hardware PC/workstation, terminasi kabel UTP RJ45, dan setup router kantor kecil.',
        tacticalPerks: ['Akses Misi Setup PC & LAN Kantor', 'Diagnostik Hardware Cepat'],
        unlockedContracts: ['Setup Jaringan Kantor 10 PC', 'Perakitan Server Kasir UMKM'],
      },
      {
        id: 'cyber_2',
        branch: 'cyber',
        name: 'Enterprise Network & Systems Engineer',
        titleIndo: 'Sistem Engineer Jaringan Enterprise',
        tier: 2,
        xpCost: 1500,
        levelRequired: 7,
        prerequisiteId: 'cyber_1',
        icon: 'server-outline',
        accent: 'amber',
        summary: 'Konfigurasi switch L3 managed, fiber optic patch, VLAN routing, dan manajemen rack server hybrid cloud.',
        tacticalPerks: ['Akses Misi Data Center Level 2', 'Bypass Jalur Diagnostik Fiber', '+20% Reward Escrow'],
        unlockedContracts: ['Maintenance Rack Server Komersial', 'Fiber Optic Splicing Menara Sudirman'],
      },
      {
        id: 'cyber_3',
        branch: 'cyber',
        name: 'Cybersecurity & Threat Specialist',
        titleIndo: 'Cybersecurity Specialist',
        tier: 3,
        xpCost: 3000,
        levelRequired: 14,
        prerequisiteId: 'cyber_2',
        icon: 'lock-closed-outline',
        accent: 'purple',
        summary: 'Zero-Trust network containment, forensik insiden siber, enkripsi vault, dan pemulihan server down kritis.',
        tacticalPerks: ['Akses Kontrak Korporat Rahasia (Rp 2.5M+)', 'Gate Break Network Priority Dispatch', 'Gelar Pangkat: Elite Security Architect'],
        unlockedContracts: ['Mitigasi Server Crash Bank Sentral', 'Zero-Trust Audit Corporate Executive Array'],
      },
    ],
  },
  {
    id: 'mechanical',
    name: 'AUTOMOTIVE & HEAVY RECOVERY',
    subtitle: 'Mekanik Darurat Jalan Raya ➔ Heavy Fleet Hydraulics',
    accent: 'amber',
    icon: 'car-outline',
    description: 'Jalur spesialisasi mekanikal jalan raya, evakuasi kendaraan jalur cepat, hingga hidrolik alat berat.',
    nodes: [
      {
        id: 'mech_1',
        branch: 'mechanical',
        name: 'Emergency Roadside Mechanic',
        titleIndo: 'Mekanik Darurat Jalan Raya',
        tier: 1,
        xpCost: 0,
        levelRequired: 1,
        prerequisiteId: null,
        icon: 'battery-charging-outline',
        accent: 'cyan',
        summary: 'Penanganan jumper aki mati, penggantian ban darurat, dan diagnosa starter kendaraan mogok.',
        tacticalPerks: ['Akses Misi Roadside Assistance', 'Toolkit Darurat Standar'],
        unlockedContracts: ['Jumpstart Aki Mogok Parkiran', 'Ganti Ban Darurat Jalan Protokol'],
      },
      {
        id: 'mech_2',
        branch: 'mechanical',
        name: 'Highway Recovery & Flatbed Specialist',
        titleIndo: 'Spesialis Evakuasi Jalan Tol',
        tier: 2,
        xpCost: 1400,
        levelRequired: 6,
        prerequisiteId: 'mech_1',
        icon: 'speedometer-outline',
        accent: 'amber',
        summary: 'Towing derek flatbed darurat kecepatan tinggi pada jalur bebas hambatan tanpa merusak sistem transmisi.',
        tacticalPerks: ['Akses Misi Evakuasi Tol KM 10-50', 'Prioritas Pengawalan Lalu Lintas', '+15% Escrow Payout'],
        unlockedContracts: ['Emergency Highway Towing Bypass', 'Evakuasi Transmisi Terkunci Jalur Cepat'],
      },
      {
        id: 'mech_3',
        branch: 'mechanical',
        name: 'Heavy Industrial Fleet Hydraulics',
        titleIndo: 'Master Hidrolik Alat Berat & Armada',
        tier: 3,
        xpCost: 2800,
        levelRequired: 13,
        prerequisiteId: 'mech_2',
        icon: 'construct-outline',
        accent: 'crimson',
        summary: 'Overhaul pompa hidrolik tekanan tinggi, crane pelabuhan, dan perbaikan mesin diesel armada logistik berat.',
        tacticalPerks: ['Akses Kontrak Proyek Pelabuhan & Tambang', '+30% Hero Coins Multiplier', 'Gelar Pangkat: Heavy Fleet Commander'],
        unlockedContracts: ['Overhaul Hidrolik Crane Dermaga', 'Perbaikan Diesel Generator 1000kVA'],
      },
    ],
  },
];
