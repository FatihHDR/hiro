import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useAppState } from '../../context/AppStateContext';
import {
  Text,
  TacticalHeader,
  Avatar,
  Badge,
  BadgeColor,
  Button,
  TacticalCard,
  StatTile,
  ProgressBar,
  Divider,
} from '../../components/ui';
import { CareerSkillTreeModal } from '../../components/skill-tree/CareerSkillTreeModal';
import { EscrowVaultModal } from '../../components/escrow/EscrowVaultModal';
import { DualCurrencyShopModal } from '../../components/shop/DualCurrencyShopModal';
import { SidekickMentorshipModal } from '../../components/mentorship/SidekickMentorshipModal';
import { KycVerificationModal } from '../../components/profile/KycVerificationModal';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const router = useRouter();
  const { user, logout } = useAppState();

  const [isSkillTreeVisible, setIsSkillTreeVisible] = useState(false);
  const [isEscrowModalVisible, setIsEscrowModalVisible] = useState(false);
  const [isShopModalVisible, setIsShopModalVisible] = useState(false);
  const [isMentorshipModalVisible, setIsMentorshipModalVisible] = useState(false);
  const [isKycModalVisible, setIsKycModalVisible] = useState(false);

  const getKycBadgeColor = (): BadgeColor => {
    switch (user.verificationStatus) {
      case 'verified':
      case 'elite':
        return 'emerald';
      case 'pending':
        return 'amber';
      case 'unverified':
      default:
        return 'crimson';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <TacticalHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card / RPG Stat Sheet */}
        <TacticalCard accent="cyan" elevated style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <Avatar
              name={user.name}
              level={user.level}
              isVerified={user.verificationStatus === 'verified' || user.verificationStatus === 'elite'}
              size="xl"
            />

            <View style={styles.profileMainInfo}>
              <View style={styles.callsignLine}>
                <Text variant="h2" mono color={colors.primary}>
                  {user.callsign}
                </Text>
                <Badge
                  label={user.verificationStatus.toUpperCase()}
                  color={getKycBadgeColor()}
                  variant="status"
                  style={{ marginLeft: 8 }}
                />
              </View>

              <Text variant="subheading" weight="semibold">
                {user.name}
              </Text>
              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                {user.rankTitle}
              </Text>
            </View>
          </View>

          {user.bio && (
            <View style={[styles.bioBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text variant="caption" color={colors.textSecondary}>
                {`"${user.bio}"`}
              </Text>
            </View>
          )}

          {/* Level & XP Progression */}
          <ProgressBar
            progress={user.xp / user.nextLevelXp}
            label={`RANK PROGRESSION // LEVEL ${user.level}`}
            valueText={`${user.xp.toLocaleString()} / ${user.nextLevelXp.toLocaleString()} XP`}
            color={colors.primary}
            height={8}
            style={{ marginTop: 12 }}
          />
        </TacticalCard>

        {/* The Sidekick System (Built-in Mentorship) */}
        <TacticalCard accent="cyan" elevated style={styles.sidekickBanner}>
          <View style={styles.sidekickBannerHeader}>
            <View style={[styles.sidekickIconBox, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }]}>
              <Ionicons name="people" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.sidekickTitleRow}>
                <Text variant="h3" color={colors.primary}>
                  THE SIDEKICK SYSTEM
                </Text>
                <Badge
                  label={`${user.mentorInfo.sidekicks.length}/${user.mentorInfo.maxSidekicks} SLOTS`}
                  color="emerald"
                  variant="status"
                />
              </View>
              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                Bimbing hingga 2 Sidekick baru via live comms & video call. Dapatkan {user.mentorInfo.passiveXpPercentage}% Passive XP dari setiap misi mereka!
              </Text>
            </View>
          </View>

          <Button
            title="OPEN MENTORSHIP & LIVE COMMS HUD"
            variant="primary"
            size="md"
            fullWidth
            leftIcon={<Ionicons name="chatbubbles-outline" size={18} color={colors.textInverse} />}
            onPress={() => {
              trigger('selection');
              setIsMentorshipModalVisible(true);
            }}
            style={{ marginTop: 12 }}
          />
        </TacticalCard>

        {/* Career Skill Trees & Progression Banner */}
        <TacticalCard accent="cyan" elevated style={styles.skillTreeBanner}>
          <View style={styles.skillTreeBannerHeader}>
            <View style={[styles.skillIconBox, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }]}>
              <Ionicons name="git-network" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.skillTreeTitleRow}>
                <Text variant="h3" color={colors.primary}>
                  CAREER SKILL TREES
                </Text>
                <Badge
                  label={`${user.unlockedSkillNodeIds.length} ACTIVE`}
                  color="emerald"
                  variant="status"
                />
              </View>
              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                Buka cabang spesialisasi (HVAC Komersial, Cybersecurity, Heavy Recovery) untuk membuka kontrak korporat bernilai tinggi.
              </Text>
            </View>
          </View>

          <Button
            title="OPEN CAREER SKILL TREE // RPG GRAPH"
            variant="primary"
            size="md"
            fullWidth
            leftIcon={<Ionicons name="git-network-outline" size={18} color={colors.textInverse} />}
            onPress={() => {
              trigger('selection');
              setIsSkillTreeVisible(true);
            }}
            style={{ marginTop: 12 }}
          />
        </TacticalCard>

        {/* Escrow Vault & Dual-Currency Shop Hub */}
        <View style={styles.financeHubRow}>
          {/* Escrow Vault Card */}
          <TacticalCard accent="emerald" elevated style={styles.financeCard}>
            <View style={styles.financeCardHeader}>
              <View style={[styles.financeIconBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                <Ionicons name="lock-closed" size={20} color={colors.emerald} />
              </View>
              <Badge label="PROTECTED" color="emerald" variant="status" />
            </View>
            <Text variant="h3" color={colors.emerald} style={{ marginTop: 6 }}>
              ESCROW VAULT
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginVertical: 4 }}>
              Dana pembayaran tersimpan aman & diteruskan otomatis setelah konfirmasi.
            </Text>
            <Button
              title="MANAGE VAULT"
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<Ionicons name="wallet-outline" size={14} color={colors.emerald} />}
              onPress={() => {
                trigger('selection');
                setIsEscrowModalVisible(true);
              }}
            />
          </TacticalCard>

          {/* Dual-Currency Shop Card */}
          <TacticalCard accent="amber" elevated style={styles.financeCard}>
            <View style={styles.financeCardHeader}>
              <View style={[styles.financeIconBox, { backgroundColor: `${colors.amber}20`, borderColor: colors.amber }]}>
                <Ionicons name="storefront" size={20} color={colors.amber} />
              </View>
              <Badge label={`${user.heroCoins} HC`} color="amber" variant="status" />
            </View>
            <Text variant="h3" color={colors.amber} style={{ marginTop: 6 }}>
              REWARD SHOP
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginVertical: 4 }}>
              Tukarkan Hero Coins untuk BPJS, Asuransi Kecelakaan & Diskon Toolkit.
            </Text>
            <Button
              title="OPEN SHOP"
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<Ionicons name="cart-outline" size={14} color={colors.amber} />}
              onPress={() => {
                trigger('selection');
                setIsShopModalVisible(true);
              }}
            />
          </TacticalCard>
        </View>

        {/* KYC Verification Action Banner */}
        <TacticalCard
          accent={getKycBadgeColor()}
          style={styles.kycBanner}
        >
          <View style={styles.kycRow}>
            <Ionicons
              name={
                user.verificationStatus === 'verified'
                  ? 'shield-checkmark'
                  : user.verificationStatus === 'pending'
                  ? 'time-outline'
                  : 'shield-outline'
              }
              size={24}
              color={colors[getKycBadgeColor()]}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="body" weight="bold">
                KYC Verification: {user.verificationStatus.toUpperCase()}
              </Text>
              <Text variant="caption" color={colors.textSecondary}>
                {user.verificationStatus === 'verified'
                  ? 'Identity & Skill Certification validated by HIRO Protocol.'
                  : user.verificationStatus === 'pending'
                  ? 'Verification documents currently under compliance review.'
                  : 'Submit KTP and Skill certificates to unlock high-value contracts.'}
              </Text>
            </View>
            <Button
              title={user.verificationStatus === 'verified' ? 'UPDATE' : user.verificationStatus === 'elite' ? 'ELITE' : 'VERIFY'}
              variant={user.verificationStatus === 'elite' ? 'outline' : 'primary'}
              size="sm"
              onPress={() => {
                trigger('selection');
                setIsKycModalVisible(true);
              }}
            />
          </View>
        </TacticalCard>

        <Divider label="// RPG STAT SHEET & TELEMETRY" />

        {/* Stat Sheet Grid */}
        <View style={styles.statsGrid}>
          <StatTile
            label="ESCROW VAULT"
            value={`Rp ${(user.escrowBalance / 1000).toFixed(0)}k`}
            subValue="Tap to Manage"
            accentColor={colors.emerald}
            icon={<Ionicons name="lock-closed-outline" size={16} color={colors.emerald} />}
            onPress={() => setIsEscrowModalVisible(true)}
          />
          <StatTile
            label="HERO COINS"
            value={user.heroCoins}
            subValue="Tap to Redeem"
            accentColor={colors.amber}
            icon={<Ionicons name="shield-outline" size={16} color={colors.amber} />}
            onPress={() => setIsShopModalVisible(true)}
          />
        </View>

        <View style={[styles.statsGrid, { marginTop: 8 }]}>
          <StatTile
            label="TOTAL MISSIONS"
            value={user.completedMissions}
            subValue="Completed Contracts"
            accentColor={colors.primary}
            icon={<Ionicons name="checkmark-done-circle-outline" size={16} color={colors.primary} />}
          />
          <StatTile
            label="CITIZEN RATING"
            value={`${user.rating} ★`}
            subValue="5.0 Rating Standard"
            accentColor={colors.purple}
            icon={<Ionicons name="star-outline" size={16} color={colors.purple} />}
          />
        </View>

        <Divider label="// CERTIFIED SPECIALIST SKILLS" />

        {/* Certified Skills Badges */}
        <TacticalCard style={{ marginBottom: 16 }}>
          <View style={styles.skillsContainer}>
            {user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <Badge
                  key={skill}
                  label={skill}
                  color="cyan"
                  variant="status"
                  showDot
                  style={{ marginBottom: 6 }}
                />
              ))
            ) : (
              <Text variant="caption" color={colors.textMuted}>
                No skills certified yet. Unlock Skill Tree nodes or submit KYC.
              </Text>
            )}
          </View>
        </TacticalCard>

        <Divider label="// OPERATOR ACCOUNT ACTIONS" />

        <View style={styles.actionsContainer}>
          <Button
            title="SWITCH AUTH / REGISTER NEW OPERATOR"
            variant="secondary"
            fullWidth
            leftIcon={<Ionicons name="key-outline" size={16} color={colors.textPrimary} />}
            onPress={() => router.push('/auth')}
            style={{ marginBottom: 10 }}
          />

          <Button
            title="SIGN OUT OF SESSION"
            variant="danger"
            fullWidth
            leftIcon={<Ionicons name="log-out-outline" size={16} color={colors.crimson} />}
            onPress={() => {
              logout();
              router.push('/auth');
            }}
          />
        </View>
      </ScrollView>

      {/* Sidekick Mentorship Modal */}
      <SidekickMentorshipModal
        visible={isMentorshipModalVisible}
        onClose={() => setIsMentorshipModalVisible(false)}
      />

      {/* Career Skill Tree RPG Modal */}
      <CareerSkillTreeModal
        visible={isSkillTreeVisible}
        onClose={() => setIsSkillTreeVisible(false)}
      />

      {/* Escrow Vault Modal */}
      <EscrowVaultModal
        visible={isEscrowModalVisible}
        onClose={() => setIsEscrowModalVisible(false)}
      />

      {/* Dual-Currency Shop Modal */}
      <DualCurrencyShopModal
        visible={isShopModalVisible}
        onClose={() => setIsShopModalVisible(false)}
      />

      {/* KYC & Identity Integrity Verification Modal */}
      <KycVerificationModal
        visible={isKycModalVisible}
        onClose={() => setIsKycModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
  },
  profileCard: {
    marginBottom: 12,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileMainInfo: {
    flex: 1,
    marginLeft: 14,
  },
  callsignLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bioBox: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 12,
  },
  sidekickBanner: {
    marginBottom: 12,
  },
  sidekickBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidekickIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidekickTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skillTreeBanner: {
    marginBottom: 12,
  },
  skillTreeBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillTreeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  financeHubRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  financeCard: {
    flex: 1,
    padding: 12,
  },
  financeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  financeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kycBanner: {
    marginBottom: 8,
  },
  kycRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionsContainer: {
    marginTop: 4,
  },
});
