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
}

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeEmergency, setActiveEmergency] = useState<GateBreakAlert | null>(null);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);

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
      mentorInfo: {
        isMentor: false,
        sidekickCount: 0,
        maxSidekicks: 2,
        passiveXpEarned: 0,
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
