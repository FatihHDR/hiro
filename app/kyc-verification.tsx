import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';
import { useAppState } from '../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Input,
  Button,
  Badge,
  Divider,
} from '../components/ui';

const AVAILABLE_SKILLS = [
  'HVAC & Commercial Refrigeration',
  'Automotive Roadside Repair',
  'High-Voltage Electrical Maintenance',
  'Industrial Plumbing & Hydraulics',
  'Server & Cybersecurity Diagnostics',
  'Hazardous Area Deep Cleaning',
  'Emergency Locksmithing',
];

export default function KycVerificationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, submitKyc, approveKycSimulation } = useAppState();

  const [ktpNumber, setKtpNumber] = useState(user.kycDetails?.ktpNumber || '');
  const [fullName, setFullName] = useState(user.name || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    user.skills.length > 0 ? user.skills : [AVAILABLE_SKILLS[0]]
  );
  const [certUploaded, setCertUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length === 1) return;
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmitKyc = () => {
    if (!ktpNumber || ktpNumber.length < 8) {
      setErrorMsg('Please enter a valid 16-digit KTP Identification Number.');
      return;
    }
    if (!fullName) {
      setErrorMsg('Full legal name is required.');
      return;
    }

    setErrorMsg('');
    submitKyc({
      ktpNumber,
      fullName,
      skills: selectedSkills,
      certificateUrl: certUploaded ? 'cert_tactical_v5.pdf' : undefined,
      submittedAt: new Date().toISOString(),
    });
  };

  const handleInstantApprove = () => {
    approveKycSimulation();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Custom Header Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text variant="h3" style={{ flex: 1, marginLeft: 12 }}>KYC VERIFICATION</Text>
        <Badge
          label={user.verificationStatus.toUpperCase()}
          color={
            user.verificationStatus === 'verified' || user.verificationStatus === 'elite'
              ? 'emerald'
              : user.verificationStatus === 'pending'
              ? 'amber'
              : 'crimson'
          }
          variant="status"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Verification Status Banner */}
        <TacticalCard
          accent={
            user.verificationStatus === 'verified'
              ? 'emerald'
              : user.verificationStatus === 'pending'
              ? 'amber'
              : 'crimson'
          }
          elevated
          style={{ marginBottom: 16 }}
        >
          <View style={styles.statusBannerRow}>
            <Ionicons
              name={
                user.verificationStatus === 'verified'
                  ? 'checkmark-circle-outline'
                  : user.verificationStatus === 'pending'
                  ? 'time-outline'
                  : 'shield-outline'
              }
              size={24}
              color={
                user.verificationStatus === 'verified'
                  ? colors.emerald
                  : user.verificationStatus === 'pending'
                  ? colors.amber
                  : colors.crimson
              }
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="subheading" weight="bold" color={colors.textPrimary}>
                {user.verificationStatus === 'verified'
                  ? 'VERIFIED TACTICAL HERO'
                  : user.verificationStatus === 'pending'
                  ? 'VERIFICATION PENDING REVIEW'
                  : 'UNVERIFIED IDENTITY'}
              </Text>
              <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                {user.verificationStatus === 'verified'
                  ? 'Your identity and technical certificates have been validated. You have full access to high-value missions.'
                  : user.verificationStatus === 'pending'
                  ? 'Your submission is being reviewed by HIRO Compliance Protocol (ETA < 15 mins).'
                  : 'Submit your legal KTP and skill certifications to unlock Hero War Room mission dispatch.'}
              </Text>
            </View>
          </View>
        </TacticalCard>

        {user.verificationStatus === 'verified' ? (
          <View style={styles.verifiedSection}>
            <Text variant="body" color={colors.textSecondary} style={{ marginBottom: 16 }}>
              You are fully verified. You can update your certified skill specializations below.
            </Text>
            <Button
              title="RETURN TO PROFILE"
              variant="secondary"
              fullWidth
              onPress={() => router.back()}
            />
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Divider label="// 1. LEGAL IDENTIFICATION (KYC)" />

            <Input
              label="FULL LEGAL NAME (AS ON KTP)"
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Alex Vance"
              leftIcon={<Ionicons name="person-outline" size={16} color={colors.textSecondary} />}
            />

            <Input
              label="KTP IDENTIFICATION NUMBER (16-DIGIT)"
              value={ktpNumber}
              onChangeText={setKtpNumber}
              placeholder="3171000000000000"
              keyboardType="numeric"
              mono
              errorText={errorMsg}
              leftIcon={<Ionicons name="card-outline" size={16} color={colors.textSecondary} />}
            />

            <Divider label="// 2. TECHNICAL SKILL SPECIALIZATION" />
            <Text variant="caption" color={colors.textSecondary} style={{ marginBottom: 12 }}>
              Select all technical disciplines you are certified to operate:
            </Text>

            <View style={styles.skillsGrid}>
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <Pressable
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    style={[
                      styles.skillChip,
                      {
                        backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.12)' : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={16}
                      color={isSelected ? colors.primary : colors.textMuted}
                    />
                    <Text
                      variant="caption"
                      weight={isSelected ? 'bold' : 'regular'}
                      color={isSelected ? colors.primary : colors.textPrimary}
                      style={{ marginLeft: 6 }}
                    >
                      {skill}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Divider label="// 3. CERTIFICATE & DOCUMENT UPLOAD" />
            <TacticalCard style={{ marginBottom: 20 }}>
              <View style={styles.uploadRow}>
                <Ionicons
                  name={certUploaded ? 'document-text' : 'cloud-upload-outline'}
                  size={24}
                  color={certUploaded ? colors.emerald : colors.primary}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text variant="body" weight="semibold">
                    {certUploaded ? 'Tactical_Cert_V5.pdf Uploaded' : 'Upload Skill Certificate (PDF/JPG)'}
                  </Text>
                  <Text variant="caption" color={colors.textMuted}>
                    {certUploaded ? 'File validated & encrypted' : 'Optional document proof for fast-track verification'}
                  </Text>
                </View>
                <Button
                  title={certUploaded ? 'REMOVE' : 'SELECT FILE'}
                  variant={certUploaded ? 'danger' : 'outline'}
                  size="sm"
                  onPress={() => setCertUploaded(!certUploaded)}
                />
              </View>
            </TacticalCard>

            <Button
              title="SUBMIT KYC VERIFICATION"
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="checkmark-done" size={18} color={colors.textInverse} />}
              onPress={handleSubmitKyc}
              style={{ marginBottom: 12 }}
            />

            {/* Test Simulation Fast Track Button */}
            <Button
              title="⚡ DEMO FAST-TRACK: INSTANT APPROVE KYC"
              variant="outline"
              size="md"
              fullWidth
              onPress={handleInstantApprove}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formContainer: {
    marginTop: 4,
  },
  verifiedSection: {
    marginTop: 20,
  },
  skillsGrid: {
    gap: 8,
    marginBottom: 16,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
