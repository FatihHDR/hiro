import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'citizen' | 'hero';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'elite';

export interface UserProfile {
  id: string;
  name: string;
  callsign: string;
  role: UserRole;
  avatarUrl?: string;
  verificationStatus: VerificationStatus;
  level: number;
  xp: number;
  nextLevelXp: number;
  rankTitle: string;
  heroCoins: number;
  escrowBalance: number; // in IDR
  rating: number;
  completedMissions: number;
  mentorInfo: {
    isMentor: boolean;
    sidekickCount: number;
    maxSidekicks: number;
    passiveXpEarned: number;
  };
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
  switchRole: (role: UserRole) => void;
  activeEmergency: GateBreakAlert | null;
  triggerEmergency: (alert: GateBreakAlert) => void;
  clearEmergency: () => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  depositEscrow: (amount: number) => void;
  releaseEscrow: (amount: number) => void;
  activeMissionId: string | null;
  setActiveMissionId: (id: string | null) => void;
}

const initialUserProfile: UserProfile = {
  id: 'usr_007',
  name: 'Alex Vance',
  callsign: 'SPECTRE-07',
  role: 'hero',
  verificationStatus: 'verified',
  level: 14,
  xp: 3450,
  nextLevelXp: 5000,
  rankTitle: 'Elite Systems Specialist',
  heroCoins: 1280,
  escrowBalance: 2450000,
  rating: 4.9,
  completedMissions: 48,
  mentorInfo: {
    isMentor: true,
    sidekickCount: 1,
    maxSidekicks: 2,
    passiveXpEarned: 450,
  },
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [activeEmergency, setActiveEmergency] = useState<GateBreakAlert | null>(null);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);

  const switchRole = (newRole: UserRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
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

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 2500;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp,
      };
    });
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

  return (
    <AppStateContext.Provider
      value={{
        user,
        role: user.role,
        switchRole,
        activeEmergency,
        triggerEmergency,
        clearEmergency,
        addXp,
        addCoins,
        depositEscrow,
        releaseEscrow,
        activeMissionId,
        setActiveMissionId,
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
