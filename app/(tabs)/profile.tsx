import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
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

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, logout } = useAppState();

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
              title={user.verificationStatus === 'verified' ? 'UPDATE' : 'VERIFY'}
              variant={user.verificationStatus === 'verified' ? 'outline' : 'primary'}
              size="sm"
              onPress={() => router.push('/kyc-verification')}
            />
          </View>
        </TacticalCard>

        <Divider label="// RPG STAT SHEET & TELEMETRY" />

        {/* Stat Sheet Grid */}
        <View style={styles.statsGrid}>
          <StatTile
            label="ESCROW VAULT"
            value={`Rp ${(user.escrowBalance / 1000).toFixed(0)}k`}
            subValue="Secured Payouts"
            accentColor={colors.emerald}
            icon={<Ionicons name="lock-closed-outline" size={16} color={colors.emerald} />}
          />
          <StatTile
            label="HERO COINS"
            value={user.heroCoins}
            subValue="Reward Tokens"
            accentColor={colors.amber}
            icon={<Ionicons name="shield-outline" size={16} color={colors.amber} />}
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
                No skills certified yet. Submit KYC to add certified skills.
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
