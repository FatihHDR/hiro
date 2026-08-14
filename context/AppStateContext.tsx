import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'citizen' | 'hero';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'elite';

export interface KycSubmission {
  ktpNumber: string;
  fullName: string;
  skills: string[];
  certificateUrl?: string;
  submittedAt: string;
}

export interface SidekickMission {
  id: string;
  title: string;
  category: string;
  location: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  xpReward: number;
  timeRemaining: string;
}

export interface SidekickProfile {
  id: string;
  name: string;
  callsign: string;
  level: number;
  specialty: string;
  avatarUrl?: string;
  activeMission?: SidekickMission;
  completedMissions: number;
  passiveXpContributed: number;
  status: 'ONLINE_IN_FIELD' | 'STANDBY' | 'MISSION_COMPLETE';
}

export interface MentorshipMessage {
  id: string;
  sidekickId: string;
  sender: 'mentor' | 'sidekick';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  callsign: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  verificationStatus: VerificationStatus;
  kycDetails?: KycSubmission;
  level: number;
  xp: number;
  nextLevelXp: number;
  rankTitle: string;
  heroCoins: number;
  escrowBalance: number; // in IDR
  rating: number;
  completedMissions: number;
  skills: string[];
  unlockedSkillNodeIds: string[];
  skillPoints: number;
  purchasedShopItemIds: string[];
  mentorInfo: {
    isMentor: boolean;
    sidekicks: SidekickProfile[];
    maxSidekicks: number;
    passiveXpEarned: number;
    passiveXpPercentage: number;
  };
}

export interface EscrowTransaction {
  id: string;
  missionTitle: string;
  category: string;
  amountIdr: number;
  citizenName: string;
  heroCallsign: string;
  status: 'HELD_IN_VAULT' | 'RELEASED_TO_HERO' | 'REFUNDED';
  paymentMethod: string;
  timestamp: string;
}

export interface GateBreakAlert {
  id: string;
  title: string;
  category: 'electrical' | 'plumbing' | 'locksmith' | 'vehicle' | 'network';
  description: string;
  location: string;
  flatFee: number;
  timeRemainingSeconds: number;
  citizenName: string;
  urgentLevel: 'CRITICAL' | 'HIGH';
}

interface AppStateContextType {
  user: UserProfile;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  register: (name: string, callsign: string, email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  submitKyc: (kycData: KycSubmission) => void;
  approveKycSimulation: () => void;
  activeEmergency: GateBreakAlert | null;
  triggerEmergency: (alert: GateBreakAlert) => void;
  clearEmergency: () => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  depositEscrow: (amount: number) => void;
  releaseEscrow: (amount: number) => void;
  activeMissionId: string | null;
  setActiveMissionId: (id: string | null) => void;
  unlockSkillNode: (nodeId: string, xpCost: number, newSkillName: string) => boolean;
  escrowTransactions: EscrowTransaction[];
  createEscrowDeposit: (tx: Omit<EscrowTransaction, 'id' | 'timestamp' | 'status'>) => void;
  confirmAndReleaseEscrow: (transactionId: string) => void;
  redeemShopItem: (itemId: string, coinPrice: number) => boolean;
  mentorshipMessages: MentorshipMessage[];
  sendMentorshipMessage: (sidekickId: string, text: string) => void;
  simulateSidekickMissionComplete: (sidekickId: string) => { sidekickXp: number; passiveMentorXp: number } | null;
  recruitSidekick: (sidekick: SidekickProfile) => boolean;
  dismissSidekick: (sidekickId: string) => void;
}

const INITIAL_SIDEKICKS: SidekickProfile[] = [
  {
    id: 'sk_01',
    name: 'Rian Pratama',
    callsign: 'NOVA-03',
    level: 4,
    specialty: 'Apprentice HVAC Technician',
    status: 'ONLINE_IN_FIELD',
    completedMissions: 12,
    passiveXpContributed: 450,
    activeMission: {
      id: 'm-sk-01',
      title: 'Residential Split AC Freon Leak & Low Suction',
      category: 'ELECTRONICS',
      location: 'Kemang Pratama Blok C',
      status: 'IN_PROGRESS',
      xpReward: 600,
      timeRemaining: '18:40 mins',
    },
  },
];

const INITIAL_MENTORSHIP_MESSAGES: MentorshipMessage[] = [
  {
    id: 'msg_01',
    sidekickId: 'sk_01',
    sender: 'sidekick',
    text: 'Halo Mentor SPECTRE-07! Tekanan manifold gauge R32 terbaca cuma 65 PSI dan pipa discharge mulai berembun es. Apakah perlu langsung flashing oli atau cukup top-up freon?',
    timestamp: '14:22',
  },
  {
    id: 'msg_02',
    sidekickId: 'sk_01',
    sender: 'mentor',
    text: 'Periksa dulu sambungan flare nut di outdoor unit dengan air sabun. Jika ada gelembung halus, kencangkan torsi flare nut dulu sebelum isi freon sampai 130 PSI pada ampere kompresor normal.',
    timestamp: '14:24',
  },
  {
    id: 'msg_03',
    sidekickId: 'sk_01',
    sender: 'sidekick',
    text: 'Siap Mentor! Ditemukan kebocoran mikro di flare nut suction. Sedang dikencangkan ulang sekarang.',
    timestamp: '14:26',
  },
];

const initialUserProfile: UserProfile = {
  id: 'usr_007',
  name: 'Alex Vance',
  callsign: 'SPECTRE-07',
  email: 'alex.vance@hiro.tech',
  role: 'hero',
  bio: 'Certified Commercial HVAC & Cybersecurity Tactical Specialist. 5+ years field experience.',
  verificationStatus: 'verified',
  level: 14,
  xp: 3450,
  nextLevelXp: 5000,
  rankTitle: 'Elite Systems Specialist',
  heroCoins: 1280,
  escrowBalance: 2450000,
  rating: 4.9,
  completedMissions: 48,
  skills: ['HVAC Repair', 'Server Maintenance', 'Roadside Towing', 'Network Security'],
  unlockedSkillNodeIds: ['hvac_1', 'cyber_1', 'mech_1', 'hvac_2', 'cyber_2'],
  skillPoints: 3,
  purchasedShopItemIds: ['benefit_bpjs'],
  mentorInfo: {
    isMentor: true,
    sidekicks: INITIAL_SIDEKICKS,
    maxSidekicks: 2,
    passiveXpEarned: 450,
    passiveXpPercentage: 15,
  },
};

const INITIAL_ESCROW_TRANSACTIONS: EscrowTransaction[] = [
  {
    id: 'tx_escrow_101',
    missionTitle: 'Commercial Server Maintenance',
    category: 'ELECTRONICS',
    amountIdr: 450000,
    citizenName: 'Starlight Media Admin',
    heroCallsign: 'SPECTRE-07',
    status: 'HELD_IN_VAULT',
    paymentMethod: 'BCA Virtual Account',
    timestamp: 'Baru saja (Locked)',
  },
  {
    id: 'tx_escrow_102',
    missionTitle: 'Emergency Highway Towing',
    category: 'MECHANICAL',
    amountIdr: 650000,
    citizenName: 'Budi Santoso',
    heroCallsign: 'SPECTRE-07',
    status: 'HELD_IN_VAULT',
    paymentMethod: 'GoPay / QRIS',
    timestamp: '15 menit yang lalu',
  },
  {
    id: 'tx_escrow_103',
    missionTitle: 'Industrial Chiller System Repair',
    category: 'HEAVY HVAC',
    amountIdr: 1200000,
    citizenName: 'ColdChain Logistics Ltd',
    heroCallsign: 'SPECTRE-07',
    status: 'HELD_IN_VAULT',
    paymentMethod: 'Mandiri VA',
    timestamp: '1 jam yang lalu',
  },
  {
    id: 'tx_escrow_099',
    missionTitle: 'Post-Construction Deep Clean',
    category: 'CLEANING',
    amountIdr: 800000,
    citizenName: 'Mega Properti Indonesia',
    heroCallsign: 'SPECTRE-07',
    status: 'RELEASED_TO_HERO',
    paymentMethod: 'BCA Virtual Account',
    timestamp: 'Kemarin (Sukses Selesai)',
  },
];

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeEmergency, setActiveEmergency] = useState<GateBreakAlert | null>(null);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>(INITIAL_ESCROW_TRANSACTIONS);

  const login = (email: string, chosenRole: UserRole) => {
    setIsAuthenticated(true);
    setUser((prev) => ({
      ...prev,
      email,
      role: chosenRole,
    }));
  };

  const register = (name: string, callsign: string, email: string, chosenRole: UserRole) => {
    setIsAuthenticated(true);
    setUser({
      id: `usr_${Date.now().toString().slice(-4)}`,
      name,
      callsign: callsign.toUpperCase(),
      email,
      role: chosenRole,
      bio: 'Newly registered tactical operator.',
      verificationStatus: 'unverified',
      level: 1,
      xp: 0,
      nextLevelXp: 1000,
      rankTitle: chosenRole === 'hero' ? 'Apprentice Specialist' : 'Citizen Client',
      heroCoins: 100,
      escrowBalance: 0,
      rating: 5.0,
      completedMissions: 0,
      skills: [],
      unlockedSkillNodeIds: ['hvac_1', 'cyber_1', 'mech_1'],
      skillPoints: 1,
      purchasedShopItemIds: [],
      mentorInfo: {
        isMentor: false,
        sidekicks: [],
        maxSidekicks: 2,
        passiveXpEarned: 0,
        passiveXpPercentage: 15,
      },
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (newRole: UserRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
    }));
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const submitKyc = (kycData: KycSubmission) => {
    setUser((prev) => ({
      ...prev,
      verificationStatus: 'pending',
      kycDetails: kycData,
      skills: kycData.skills,
    }));
  };

  const approveKycSimulation = () => {
    setUser((prev) => ({
      ...prev,
      verificationStatus: 'verified',
    }));
  };

  const triggerEmergency = (alert: GateBreakAlert) => {
    setActiveEmergency(alert);
  };

  const clearEmergency = () => {
    setActiveEmergency(null);
  };

  const addXp = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextLevelXp = prev.nextLevelXp;
      let newSkillPoints = prev.skillPoints;

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 2500;
        newSkillPoints += 1; // Gain 1 Skill Point on level up
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp,
        skillPoints: newSkillPoints,
      };
    });
  };

  const unlockSkillNode = (nodeId: string, xpCost: number, newSkillName: string): boolean => {
    if (user.unlockedSkillNodeIds.includes(nodeId)) {
      return true;
    }

    if (user.xp < xpCost) {
      return false;
    }

    setUser((prev) => {
      const updatedSkills = prev.skills.includes(newSkillName)
        ? prev.skills
        : [...prev.skills, newSkillName];

      return {
        ...prev,
        xp: Math.max(0, prev.xp - xpCost),
        unlockedSkillNodeIds: [...prev.unlockedSkillNodeIds, nodeId],
        skills: updatedSkills,
      };
    });

    return true;
  };

  const addCoins = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      heroCoins: Math.max(0, prev.heroCoins + amount),
    }));
  };

  const depositEscrow = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      escrowBalance: prev.escrowBalance + amount,
    }));
  };

  const releaseEscrow = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      escrowBalance: Math.max(0, prev.escrowBalance - amount),
    }));
  };

  const createEscrowDeposit = (tx: Omit<EscrowTransaction, 'id' | 'timestamp' | 'status'>) => {
    const newTx: EscrowTransaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      status: 'HELD_IN_VAULT',
      timestamp: 'Baru saja (Locked)',
    };
    setEscrowTransactions((prev) => [newTx, ...prev]);
    depositEscrow(tx.amountIdr);
  };

  const confirmAndReleaseEscrow = (transactionId: string) => {
    setEscrowTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === transactionId && tx.status === 'HELD_IN_VAULT') {
          releaseEscrow(tx.amountIdr);
          return {
            ...tx,
            status: 'RELEASED_TO_HERO',
            timestamp: 'Dikonfirmasi Selesai (Dana Diteruskan)',
          };
        }
        return tx;
      })
    );
  };

  const redeemShopItem = (itemId: string, coinPrice: number): boolean => {
    if (user.purchasedShopItemIds.includes(itemId)) {
      return true;
    }

    if (user.heroCoins < coinPrice) {
      return false;
    }

    setUser((prev) => ({
      ...prev,
      heroCoins: prev.heroCoins - coinPrice,
      purchasedShopItemIds: [...prev.purchasedShopItemIds, itemId],
    }));

    return true;
  };

  const [mentorshipMessages, setMentorshipMessages] = useState<MentorshipMessage[]>(INITIAL_MENTORSHIP_MESSAGES);

  const sendMentorshipMessage = (sidekickId: string, text: string) => {
    const newMsg: MentorshipMessage = {
      id: `msg_${Date.now()}`,
      sidekickId,
      sender: 'mentor',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMentorshipMessages((prev) => [...prev, newMsg]);
  };

  const simulateSidekickMissionComplete = (sidekickId: string): { sidekickXp: number; passiveMentorXp: number } | null => {
    const targetSidekick = user.mentorInfo.sidekicks.find((sk) => sk.id === sidekickId);
    if (!targetSidekick || !targetSidekick.activeMission) return null;

    const missionXp = targetSidekick.activeMission.xpReward;
    const passiveMentorXp = Math.round(missionXp * (user.mentorInfo.passiveXpPercentage / 100));

    // Award passive XP to mentor
    addXp(passiveMentorXp);

    // Update sidekick state
    setUser((prev) => ({
      ...prev,
      mentorInfo: {
        ...prev.mentorInfo,
        passiveXpEarned: prev.mentorInfo.passiveXpEarned + passiveMentorXp,
        sidekicks: prev.mentorInfo.sidekicks.map((sk) => {
          if (sk.id === sidekickId) {
            return {
              ...sk,
              completedMissions: sk.completedMissions + 1,
              passiveXpContributed: sk.passiveXpContributed + passiveMentorXp,
              status: 'STANDBY',
              activeMission: undefined,
            };
          }
          return sk;
        }),
      },
    }));

    return {
      sidekickXp: missionXp,
      passiveMentorXp,
    };
  };

  const recruitSidekick = (sidekick: SidekickProfile): boolean => {
    if (user.mentorInfo.sidekicks.length >= user.mentorInfo.maxSidekicks) {
      return false;
    }

    setUser((prev) => ({
      ...prev,
      mentorInfo: {
        ...prev.mentorInfo,
        sidekicks: [...prev.mentorInfo.sidekicks, sidekick],
      },
    }));

    return true;
  };

  const dismissSidekick = (sidekickId: string) => {
    setUser((prev) => ({
      ...prev,
      mentorInfo: {
        ...prev.mentorInfo,
        sidekicks: prev.mentorInfo.sidekicks.filter((sk) => sk.id !== sidekickId),
      },
    }));
  };

  return (
    <AppStateContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
        updateUserProfile,
        submitKyc,
        approveKycSimulation,
        activeEmergency,
        triggerEmergency,
        clearEmergency,
        addXp,
        addCoins,
        depositEscrow,
        releaseEscrow,
        activeMissionId,
        setActiveMissionId,
        unlockSkillNode,
        escrowTransactions,
        createEscrowDeposit,
        confirmAndReleaseEscrow,
        redeemShopItem,
        mentorshipMessages,
        sendMentorshipMessage,
        simulateSidekickMissionComplete,
        recruitSidekick,
        dismissSidekick,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
