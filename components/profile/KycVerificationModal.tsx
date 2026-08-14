import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useAppState } from '../../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Button,
  Badge,
  Input,
  Divider,
} from '../ui';

interface KycVerificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { user, updateUserProfile } = useAppState();

  const [ktpNumber, setKtpNumber] = useState('3171028394820004');
  const [certType, setCertType] = useState('BNSP - Teknisi Refrigerasi & Tata Udara');
  const [isUploading, setIsUploading] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const isElite = user.verificationStatus === 'elite';
  const isVerified = user.verificationStatus === 'verified' || isElite;

  const handleUpgradeElite = () => {
    setIsUploading(true);
    trigger('selection');

    setTimeout(() => {
      setIsUploading(false);
      updateUserProfile({
        verificationStatus: 'elite',
      });
      trigger('success');
      setSuccessToast('🏆 VERIFIKASI IDENTITAS & SERTIFIKASI SELESAI: STATUS HERO UPGRADED TO ELITE VERIFIED!');
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: 'rgba(0, 0, 0, 0.75)' }]}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.background,
              borderColor: `${colors.primary}60`,
            },
          ]}
        >
          {/* Top Light Ray */}
          <View style={[styles.topLightRay, { backgroundColor: colors.primary }]} />

          {/* Modal Header */}
          <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.headerIconBox, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }]}>
                <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text variant="h3" color={colors.primary} style={{ letterSpacing: 0.5 }}>
                  KYC & INTEGRITY VERIFICATION
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  IDENTITY ENCRYPTION & TECHNICAL CERTIFICATION GATE
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                trigger('light');
                onClose();
              }}
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Verification Status Banner */}
            <TacticalCard
              accent={isElite ? 'emerald' : isVerified ? 'cyan' : 'amber'}
              elevated
              style={styles.statusCard}
            >
              <View style={styles.statusCardHeader}>
                <View style={styles.statusLeft}>
                  <View
                    style={[
                      styles.statusIconBox,
                      {
                        backgroundColor: isElite
                          ? `${colors.emerald}20`
                          : isVerified
                          ? `${colors.primary}20`
                          : `${colors.amber}20`,
                        borderColor: isElite
                          ? colors.emerald
                          : isVerified
                          ? colors.primary
                          : colors.amber,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isElite ? 'ribbon' : isVerified ? 'checkmark-circle' : 'time'}
                      size={22}
                      color={isElite ? colors.emerald : isVerified ? colors.primary : colors.amber}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text variant="h3" style={{ fontSize: 16 }}>
                      {isElite ? 'ELITE VERIFIED HERO' : isVerified ? 'STANDARD VERIFIED' : 'PENDING KYC'}
                    </Text>
                    <Text variant="caption" color={colors.textSecondary}>
                      {isElite
                        ? 'Full Corporate B2B & Raid Dispatch Access'
                        : isVerified
                        ? 'Standard Local Mission Clearance'
                        : 'Upload KTP & Certificates to unlock advanced missions'}
                    </Text>
                  </View>
                </View>
                <Badge
                  label={user.verificationStatus.toUpperCase()}
                  color={isElite ? 'emerald' : isVerified ? 'cyan' : 'amber'}
                  variant="status"
                />
              </View>
            </TacticalCard>

            {/* Success Toast */}
            {successToast ? (
              <View style={[styles.toastBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                <Ionicons name="shield-checkmark" size={18} color={colors.emerald} />
                <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 8, flex: 1 }}>
                  {successToast}
                </Text>
              </View>
            ) : null}

            {/* Step 1: KTP / Identity Record */}
            <Divider label="// 1. GOVERNMENT IDENTITY (KTP / PASSPORT)" />

            <TacticalCard accent="cyan" style={styles.formCard}>
              <Input
                label="NOMOR INDUK KEPENDUDUKAN (NIK)"
                value={ktpNumber}
                onChangeText={setKtpNumber}
                placeholder="16-Digit NIK KTP"
              />

              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.emerald} />
                <Text variant="caption" color={colors.emerald} style={{ marginLeft: 6, flex: 1 }}>
                  Kependudukan & SKCK Terverifikasi via Database Dukcapil
                </Text>
              </View>
            </TacticalCard>

            {/* Step 2: Technical Certification & License */}
            <Divider label="// 2. PROFESSIONAL & TECHNICAL CERTIFICATION" />

            <TacticalCard accent="emerald" style={styles.formCard}>
              <Input
                label="SERTIFIKASI PROFESI / LEMBAGA"
                value={certType}
                onChangeText={setCertType}
                placeholder="Nama Sertifikasi BNSP / Kemenaker / Vendor"
              />

              <View style={[styles.certUploadBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                <Ionicons name="document-attach" size={24} color={colors.primary} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text variant="caption" weight="bold" color={colors.textPrimary}>
                    Sertifikat_Kompetensi_BNSP_HVAC.pdf
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 10 }}>
                    Verified by BNSP • Valid through 2028
                  </Text>
                </View>
                <Badge label="ACTIVE" color="emerald" variant="status" />
              </View>
            </TacticalCard>

            {/* Step 3: Emergency Dispatch Insurance Clearance */}
            <Divider label="// 3. BPJS KETENAGAKERJAAN & ACCIDENT CLEARANCE" />

            <TacticalCard accent="purple" style={styles.formCard}>
              <View style={styles.insuranceRow}>
                <Ionicons name="medkit" size={22} color={colors.purple} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text variant="body" weight="bold" color={colors.purple}>
                    BPJS Ketenagakerjaan Terhubung
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM) aktif untuk perlindungan saat bertugas di lapangan.
                  </Text>
                </View>
              </View>
            </TacticalCard>

            {/* Upgrade CTA */}
            {!isElite && (
              <Button
                title={isUploading ? 'VERIFYING CREDENTIALS...' : 'UPGRADE TO ELITE VERIFIED HERO'}
                variant="primary"
                size="lg"
                fullWidth
                loading={isUploading}
                leftIcon={<Ionicons name="sparkles" size={18} color={colors.textInverse} />}
                onPress={handleUpgradeElite}
                style={{ marginTop: 14 }}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '92%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  topLightRay: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 2.5,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  statusCard: {
    marginBottom: 10,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  statusIconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  formCard: {
    marginBottom: 10,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  certUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
  },
  insuranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
