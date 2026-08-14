import { BadgeColor } from '../components/ui';

export type ShopCategory = 'PROFESSIONAL_BENEFITS' | 'PROFILE_CUSTOMIZATION';

export interface ShopItem {
  id: string;
  title: string;
  subtitle: string;
  category: ShopCategory;
  coinPrice: number;
  cashEquivalentIdr: string;
  icon: string;
  accent: BadgeColor;
  description: string;
  benefitPerks: string[];
  partnerLogo?: string;
}

export const SHOP_CATALOG: ShopItem[] = [
  // 1. Manfaat Profesional: Diskon Peralatan & Subsidi Asuransi / Kesehatan
  {
    id: 'benefit_bpjs',
    title: 'Subsidi BPJS Ketenagakerjaan',
    subtitle: 'Perlindungan JKK & JKM 1 Bulan Penuh',
    category: 'PROFESSIONAL_BENEFITS',
    coinPrice: 600,
    cashEquivalentIdr: 'Rp 175.000',
    icon: 'shield-checkmark-outline',
    accent: 'emerald',
    description: 'Subsidi penuh premi Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM) untuk proteksi operasional di lapangan.',
    benefitPerks: [
      'Perlindungan medis tanpa batas biaya saat bertugas',
      'Santunan kecelakaan kerja resmi dari pemerintah',
      'Klaim langsung via HIRO Partner Portal',
    ],
  },
  {
    id: 'benefit_accident_insurance',
    title: 'Asuransi Kecelakaan Kerja Tactical Field',
    subtitle: 'Premi Asuransi Ekstra 3 Bulan Proteksi',
    category: 'PROFESSIONAL_BENEFITS',
    coinPrice: 1000,
    cashEquivalentIdr: 'Rp 450.000',
    icon: 'medkit-outline',
    accent: 'crimson',
    description: 'Polis asuransi tambahan khusus untuk Hero yang mengambil misi berisiko tinggi (HVAC Industri, Listrik Tegangan Tinggi, dan Towing Jalan Tol).',
    benefitPerks: [
      'Cover santunan hingga Rp 100.000.000 per insiden',
      'Penggantian kerusakan toolkit saat terjadi kecelakaan',
      'Layanan ambulans prioritas Gate Break',
    ],
  },
  {
    id: 'benefit_toolkit_discount',
    title: 'Voucher Diskon 30% Toolkit Profesional',
    subtitle: 'Mitra Resmi: Krisbow / Bosch / Fluke',
    category: 'PROFESSIONAL_BENEFITS',
    coinPrice: 450,
    cashEquivalentIdr: 'Rp 300.000',
    icon: 'construct-outline',
    accent: 'amber',
    description: 'Diskon langsung untuk pembelian peralatan teknis seperti multimeter digital, manifold gauge AC, obeng torsi, dan mesin bor.',
    benefitPerks: [
      'Diskon 30% tanpa minimal belanja',
      'Berlaku di seluruh outlet resmi mitra & e-commerce',
      'Garansi resmi 1 tahun untuk alat berdaya listrik',
    ],
  },
  {
    id: 'benefit_vehicle_service',
    title: 'Diskon 40% Servis & Ban Kendaraan',
    subtitle: 'Mitra Bengkel Resmi & Toko Ban Motor/Mobil',
    category: 'PROFESSIONAL_BENEFITS',
    coinPrice: 550,
    cashEquivalentIdr: 'Rp 250.000',
    icon: 'car-outline',
    accent: 'cyan',
    description: 'Potongan harga servis berkala, ganti oli mesin, dan pergantian ban operasional untuk menjaga mobilitas Hero di lapangan.',
    benefitPerks: [
      'Diskon 40% jasa servis + sparepart oli',
      'Gratis cek balancing & kelistrikan aki',
      'Antrean prioritas khusus mitra HIRO',
    ],
  },

  // 2. Kustomisasi Profil: Animasi & Lencana Khusus
  {
    id: 'cosmetic_neon_aura',
    title: 'Cyberpunk Neon Matrix Aura',
    subtitle: 'Animasi Ring Glow pada Avatar Profil',
    category: 'PROFILE_CUSTOMIZATION',
    coinPrice: 350,
    cashEquivalentIdr: 'Rp 100.000',
    icon: 'color-palette-outline',
    accent: 'cyan',
    description: 'Efek visual animasi ring holografik bercahaya neon cyan pada avatar dan radar War Room.',
    benefitPerks: [
      'Efek aura bercahaya interaktif di profil',
      'Reticle radar War Room menyala lebih terang',
      'Tanda visual eksklusif di Citizen Radar',
    ],
  },
  {
    id: 'cosmetic_gold_veteran_badge',
    title: 'Lencana Taktis Gold Veteran',
    subtitle: 'Emblem Khusus Spesialis Lapangan Berpengalaman',
    category: 'PROFILE_CUSTOMIZATION',
    coinPrice: 500,
    cashEquivalentIdr: 'Rp 150.000',
    icon: 'ribbon-outline',
    accent: 'amber',
    description: 'Lencana kehormatan emas yang dipasang di samping Callsign untuk meningkatkan kepercayaan Citizen saat memilih Hero.',
    benefitPerks: [
      'Lencana emas taktis di header dan kartu profil',
      '+10% CTR penerimaan langsung dari klien Citizen',
      'Badge verified prioritas di Tactical War Room',
    ],
  },
  {
    id: 'cosmetic_holographic_callsign',
    title: 'Holographic Callsign Matrix FX',
    subtitle: 'Efek Tipografi Glitch Retro-Futuristic',
    category: 'PROFILE_CUSTOMIZATION',
    coinPrice: 600,
    cashEquivalentIdr: 'Rp 200.000',
    icon: 'sparkles-outline',
    accent: 'purple',
    description: 'Kustomisasi gaya font dan efek glitch matriks ungu pada nama Callsign Operator Anda.',
    benefitPerks: [
      'Gaya font monospace bercahaya ungu eksklusif',
      'Animasi transisi HUD saat membuka Tactical War Room',
      'Tampilan premium di Leaderboard Misi',
    ],
  },
];
