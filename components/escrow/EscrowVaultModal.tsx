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
import { useAppState, EscrowTransaction } from '../../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Button,
  Badge,
  BadgeColor,
  Divider,
} from '../ui';

interface EscrowVaultModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EscrowVaultModal: React.FC<EscrowVaultModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const {
    user,
    role,
    escrowTransactions,
    confirmAndReleaseEscrow,
    createEscrowDeposit,
  } = useAppState();

  const [filter, setFilter] = useState<'ALL' | 'HELD' | 'RELEASED'>('ALL');
  const [successToast, setSuccessToast] = useState<string>('');

  const filteredTransactions = escrowTransactions.filter((tx) => {
    if (filter === 'ALL') return true;
    if (filter === 'HELD') return tx.status === 'HELD_IN_VAULT';
    if (filter === 'RELEASED') return tx.status === 'RELEASED_TO_HERO';
    return true;
  });

  const totalHeldInVault = escrowTransactions
    .filter((tx) => tx.status === 'HELD_IN_VAULT')
    .reduce((sum, tx) => sum + tx.amountIdr, 0);

  const totalReleased = escrowTransactions
    .filter((tx) => tx.status === 'RELEASED_TO_HERO')
    .reduce((sum, tx) => sum + tx.amountIdr, 0);

  const handleReleaseFunds = (tx: EscrowTransaction) => {
    trigger('success');
    confirmAndReleaseEscrow(tx.id);
    setSuccessToast(`🎉 DANA RP ${tx.amountIdr.toLocaleString('id-ID')} BERHASIL DITERUSKAN KE HERO (${tx.heroCallsign})!`);
  };

  const handleSimulateDeposit = () => {
    trigger('selection');
    createEscrowDeposit({
      missionTitle: 'Emergency AC Split Diagnostic',
      category: 'ELECTRONICS',
      amountIdr: 350000,
      citizenName: user.name || 'Citizen Client',
      heroCallsign: 'SPECTRE-07',
      paymentMethod: 'GoPay / QRIS',
    });
    setSuccessToast('⚡ DEPOSIT ESCROW SEBESAR RP 350.000 BERHASIL DIKUNCI DI VAULT!');
  };

  const getStatusBadge = (status: EscrowTransaction['status']): { label: string; color: BadgeColor } => {
    switch (status) {
      case 'HELD_IN_VAULT':
        return { label: 'HELD IN ESCROW VAULT', color: 'amber' };
      case 'RELEASED_TO_HERO':
        return { label: 'RELEASED TO HERO', color: 'emerald' };
      case 'REFUNDED':
        return { label: 'REFUNDED TO CITIZEN', color: 'crimson' };
      default:
        return { label: status, color: 'muted' };
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.surface, borderColor: colors.emerald },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.lockIconBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                <Ionicons name="lock-closed" size={20} color={colors.emerald} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text variant="h3" color={colors.emerald}>
                  SECURE ESCROW VAULT
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  Encrypted Financial Transaction Ledger & Fund Release
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                trigger('light');
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Vault Balance Telemetry Grid */}
            <View style={styles.vaultStatsGrid}>
              <TacticalCard accent="emerald" elevated style={styles.statCardHalf}>
                <Text variant="caption" color={colors.textMuted}>FUNDS HELD IN VAULT</Text>
                <Text variant="h2" color={colors.emerald} style={{ marginVertical: 2 }}>
                  Rp {(totalHeldInVault / 1000).toFixed(0)}k
                </Text>
                <Text variant="caption" color={colors.emerald}>
                  • Protected & Secured
                </Text>
              </TacticalCard>

              <TacticalCard accent="cyan" style={styles.statCardHalf}>
                <Text variant="caption" color={colors.textMuted}>TOTAL PAYOUTS RELEASED</Text>
                <Text variant="h2" color={colors.primary} style={{ marginVertical: 2 }}>
                  Rp {(totalReleased / 1000).toFixed(0)}k
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  • Completed Contracts
                </Text>
              </TacticalCard>
            </View>

            {/* Escrow Guarantee Protocol Explainer Banner */}
            <TacticalCard accent="emerald" style={{ marginVertical: 12 }}>
              <View style={styles.protocolRow}>
                <Ionicons name="shield-checkmark" size={24} color={colors.emerald} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text variant="body" weight="bold" color={colors.emerald}>
                    HIRO ZERO-RISK ESCROW PROTOCOL
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    Dana dipotong dari Citizen saat pemesanan (via Virtual Account/QRIS) dan ditahan sistem. Dana **hanya akan dicairkan ke Hero** setelah Citizen mengonfirmasi penyelesaian pekerjaan.
                  </Text>
                </View>
              </View>
            </TacticalCard>

            {/* Success Action Toast Banner */}
            {successToast ? (
              <View style={[styles.toastBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />
                <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 8, flex: 1 }}>
                  {successToast}
                </Text>
              </View>
            ) : null}

            {/* Filter Tabs & Quick Action */}
            <View style={styles.filterHeaderRow}>
              <Divider label="// ESCROW TRANSACTION LEDGER" style={{ flex: 1 }} />
              {role === 'citizen' && (
                <Button
                  title="+ TOP UP / DEPOSIT"
                  variant="outline"
                  size="sm"
                  leftIcon={<Ionicons name="add-circle-outline" size={14} color={colors.emerald} />}
                  onPress={handleSimulateDeposit}
                />
              )}
            </View>

            <View style={styles.filterChipsRow}>
              {[
                { id: 'ALL', label: 'ALL TRANSACTIONS' },
                { id: 'HELD', label: 'HELD IN VAULT' },
                { id: 'RELEASED', label: 'RELEASED' },
              ].map((tab) => {
                const isActive = filter === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => {
                      trigger('light');
                      setFilter(tab.id as any);
                    }}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive ? `${colors.emerald}20` : colors.surfaceElevated,
                        borderColor: isActive ? colors.emerald : colors.border,
                      },
                    ]}
                  >
                    <Text
                      variant="mono"
                      weight={isActive ? 'bold' : 'regular'}
                      color={isActive ? colors.emerald : colors.textSecondary}
                      style={{ fontSize: 10 }}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Transaction Cards */}
            {filteredTransactions.map((tx) => {
              const badge = getStatusBadge(tx.status);
              const isHeld = tx.status === 'HELD_IN_VAULT';

              return (
                <TacticalCard
                  key={tx.id}
                  accent={isHeld ? 'amber' : 'emerald'}
                  style={styles.txCard}
                  elevated={isHeld}
                >
                  <View style={styles.txCardHeader}>
                    <Badge label={badge.label} color={badge.color} variant="status" />
                    <Text variant="mono" weight="bold" color={colors[badge.color as keyof typeof colors]}>
                      Rp {tx.amountIdr.toLocaleString('id-ID')}
                    </Text>
                  </View>

                  <Text variant="h3" style={styles.txTitle}>
                    {tx.missionTitle}
                  </Text>

                  <View style={styles.txMetaGrid}>
                    <View style={styles.txMetaItem}>
                      <Ionicons name="person-outline" size={12} color={colors.textMuted} />
                      <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                        Client: <Text variant="caption" weight="bold">{tx.citizenName}</Text>
                      </Text>
                    </View>

                    <View style={styles.txMetaItem}>
                      <Ionicons name="shield-outline" size={12} color={colors.textMuted} />
                      <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                        Hero: <Text variant="caption" weight="bold" color={colors.primary}>{tx.heroCallsign}</Text>
                      </Text>
                    </View>

                    <View style={styles.txMetaItem}>
                      <Ionicons name="card-outline" size={12} color={colors.textMuted} />
                      <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                        Method: {tx.paymentMethod}
                      </Text>
                    </View>

                    <View style={styles.txMetaItem}>
                      <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                      <Text variant="caption" color={colors.textMuted} style={{ marginLeft: 4 }}>
                        {tx.timestamp}
                      </Text>
                    </View>
                  </View>

                  {/* Citizen Release Action Button */}
                  {isHeld && (
                    <View style={styles.releaseActionRow}>
                      <Button
                        title="✓ CONFIRM JOB & RELEASE ESCROW TO HERO"
                        variant="primary"
                        size="sm"
                        fullWidth
                        leftIcon={<Ionicons name="checkmark-done" size={16} color={colors.textInverse} />}
                        onPress={() => handleReleaseFunds(tx)}
                      />
                    </View>
                  )}
                </TacticalCard>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '88%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  vaultStatsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCardHalf: {
    flex: 1,
    padding: 12,
  },
  protocolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    marginTop: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  txCard: {
    marginBottom: 12,
  },
  txCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txTitle: {
    fontSize: 15,
    marginBottom: 6,
  },
  txMetaGrid: {
    gap: 4,
  },
  txMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  releaseActionRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
});
