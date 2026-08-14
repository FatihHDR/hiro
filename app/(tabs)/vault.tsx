import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useAppState, EscrowTransaction } from '../../context/AppStateContext';
import { SHOP_CATALOG, ShopItem, ShopCategory } from '../../constants/shopItems';
import {
  Text,
  TacticalHeader,
  TacticalCard,
  Button,
  Badge,
  BadgeColor,
  SegmentedControl,
  Divider,
} from '../../components/ui';

export default function VaultScreen() {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const {
    user,
    role,
    escrowTransactions,
    confirmAndReleaseEscrow,
    createEscrowDeposit,
    redeemShopItem,
  } = useAppState();

  const [mainTab, setMainTab] = useState<'ESCROW' | 'SHOP'>('ESCROW');
  const [escrowFilter, setEscrowFilter] = useState<'ALL' | 'HELD' | 'RELEASED'>('ALL');
  const [shopCategoryFilter, setShopCategoryFilter] = useState<'ALL' | ShopCategory>('ALL');
  const [successToast, setSuccessToast] = useState<string>('');

  // Escrow Calculations
  const filteredTransactions = escrowTransactions.filter((tx) => {
    if (escrowFilter === 'ALL') return true;
    if (escrowFilter === 'HELD') return tx.status === 'HELD_IN_VAULT';
    if (escrowFilter === 'RELEASED') return tx.status === 'RELEASED_TO_HERO';
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

  // Shop Calculations
  const isPurchased = (itemId: string): boolean => {
    return user.purchasedShopItemIds.includes(itemId);
  };

  const filteredShopItems = SHOP_CATALOG.filter((item) => {
    if (shopCategoryFilter === 'ALL') return true;
    return item.category === shopCategoryFilter;
  });

  const handleRedeemItem = (item: ShopItem) => {
    if (isPurchased(item.id)) return;

    if (user.heroCoins < item.coinPrice) {
      trigger('error');
      setSuccessToast(`❌ HERO COINS TIDAK MENCUKUPI (Butuh ${item.coinPrice} HC, Anda punya ${user.heroCoins} HC).`);
      return;
    }

    const success = redeemShopItem(item.id, item.coinPrice);
    if (success) {
      trigger('success');
      setSuccessToast(`🎉 BERHASIL MENUKARKAN: ${item.title.toUpperCase()}!`);
    }
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <TacticalHeader />

      <View style={styles.content}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text variant="h2">FINANCIAL VAULT & SHOP</Text>
            <Text variant="caption" color={colors.textSecondary}>
              SECURE ESCROW PAYOUTS & DUAL-CURRENCY REWARD EXCHANGE
            </Text>
          </View>
        </View>

        {/* Top Dual Currency Balances Card */}
        <TacticalCard accent="emerald" elevated style={styles.balancesCard}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text variant="caption" color={colors.textMuted}>ESCROW VAULT (FIAT)</Text>
              <View style={styles.coinValueRow}>
                <Ionicons name="wallet-outline" size={18} color={colors.emerald} />
                <Text variant="h2" color={colors.emerald} style={{ marginLeft: 6 }}>
                  Rp {(user.escrowBalance / 1000).toFixed(0)}k
                </Text>
              </View>
              <Text variant="caption" color={colors.textSecondary}>
                Guaranteed escrow balance
              </Text>
            </View>

            <View style={[styles.dividerVertical, { backgroundColor: colors.border }]} />

            <View style={styles.balanceItem}>
              <Text variant="caption" color={colors.textMuted}>HERO COINS (DIGITAL)</Text>
              <View style={styles.coinValueRow}>
                <Ionicons name="shield" size={18} color={colors.amber} />
                <Text variant="h2" color={colors.amber} style={{ marginLeft: 6 }}>
                  {user.heroCoins} <Text variant="caption">HC</Text>
                </Text>
              </View>
              <Text variant="caption" color={colors.textSecondary}>
                5★ Mission Rating Tokens
              </Text>
            </View>
          </View>
        </TacticalCard>

        {/* Section Switcher */}
        <SegmentedControl
          options={[
            { value: 'ESCROW', label: 'SECURE ESCROW VAULT' },
            { value: 'SHOP', label: 'DUAL-CURRENCY SHOP' },
          ]}
          selectedValue={mainTab}
          onSelect={(val) => {
            trigger('selection');
            setMainTab(val as any);
            setSuccessToast('');
          }}
          style={{ marginVertical: 10 }}
        />

        {/* Feedback Toast */}
        {successToast ? (
          <View style={[styles.toastBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
            <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />
            <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 8, flex: 1 }}>
              {successToast}
            </Text>
          </View>
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {mainTab === 'ESCROW' ? (
            <>
              {/* Escrow Telemetry */}
              <View style={styles.vaultStatsGrid}>
                <TacticalCard accent="emerald" elevated style={styles.statCardHalf}>
                  <Text variant="caption" color={colors.textMuted}>FUNDS HELD IN VAULT</Text>
                  <Text variant="h2" color={colors.emerald} style={{ marginVertical: 2 }}>
                    Rp {(totalHeldInVault / 1000).toFixed(0)}k
                  </Text>
                  <Text variant="caption" color={colors.emerald}>
                    • Protected in Escrow
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

              {/* Escrow Guarantee Banner */}
              <TacticalCard accent="emerald" style={{ marginVertical: 10 }}>
                <View style={styles.protocolRow}>
                  <Ionicons name="shield-checkmark" size={24} color={colors.emerald} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text variant="body" weight="bold" color={colors.emerald}>
                      ZERO-RISK ESCROW PROTECTION
                    </Text>
                    <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                      Dana dipotong saat order (BCA VA / QRIS) dan dikunci dalam sistem. Dana baru diteruskan ke Hero setelah Citizen mengonfirmasi penyelesaian pekerjaan.
                    </Text>
                  </View>
                </View>
              </TacticalCard>

              {/* Escrow Ledger Filter */}
              <View style={styles.filterHeaderRow}>
                <Divider label="// ESCROW TRANSACTION LEDGER" style={{ flex: 1 }} />
                {role === 'citizen' && (
                  <Button
                    title="+ TOP UP"
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
                  const isActive = escrowFilter === tab.id;
                  return (
                    <Pressable
                      key={tab.id}
                      onPress={() => {
                        trigger('light');
                        setEscrowFilter(tab.id as any);
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

              {/* Transactions List */}
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

                    <Text variant="h3" style={{ fontSize: 15, marginBottom: 4 }}>
                      {tx.missionTitle}
                    </Text>

                    <View style={styles.txMetaGrid}>
                      <Text variant="caption" color={colors.textSecondary}>
                        Client: <Text variant="caption" weight="bold">{tx.citizenName}</Text> • Hero: <Text variant="caption" weight="bold" color={colors.primary}>{tx.heroCallsign}</Text>
                      </Text>
                      <Text variant="caption" color={colors.textMuted}>
                        Method: {tx.paymentMethod} • {tx.timestamp}
                      </Text>
                    </View>

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
            </>
          ) : (
            <>
              {/* Shop Category Chips */}
              <Divider label="// REWARD CATALOG CATEGORIES" />

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                {[
                  { id: 'ALL', label: 'ALL REWARDS' },
                  { id: 'PROFESSIONAL_BENEFITS', label: 'PROFESSIONAL BENEFITS (DISCOUNT & INSURANCE)' },
                  { id: 'PROFILE_CUSTOMIZATION', label: 'PROFILE CUSTOMIZATION (ANIMATIONS & BADGES)' },
                ].map((chip) => {
                  const isActive = shopCategoryFilter === chip.id;
                  return (
                    <Pressable
                      key={chip.id}
                      onPress={() => {
                        trigger('light');
                        setShopCategoryFilter(chip.id as any);
                        setSuccessToast('');
                      }}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isActive ? `${colors.amber}20` : colors.surfaceElevated,
                          borderColor: isActive ? colors.amber : colors.border,
                        },
                      ]}
                    >
                      <Text
                        variant="mono"
                        weight={isActive ? 'bold' : 'regular'}
                        color={isActive ? colors.amber : colors.textSecondary}
                        style={{ fontSize: 10 }}
                      >
                        {chip.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Shop Item Cards */}
              {filteredShopItems.map((item) => {
                const owned = isPurchased(item.id);
                const canAfford = user.heroCoins >= item.coinPrice;

                return (
                  <TacticalCard
                    key={item.id}
                    accent={item.accent}
                    style={styles.itemCard}
                    elevated={owned}
                  >
                    <View style={styles.itemHeader}>
                      <View style={styles.itemHeaderLeft}>
                        <View style={[styles.itemIconBox, { backgroundColor: `${colors[item.accent as keyof typeof colors]}20`, borderColor: colors[item.accent as keyof typeof colors] }]}>
                          <Ionicons name={item.icon as any} size={22} color={colors[item.accent as keyof typeof colors]} />
                        </View>
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text variant="h3" style={{ fontSize: 15 }}>
                            {item.title}
                          </Text>
                          <Text variant="caption" color={colors.textSecondary}>
                            {item.subtitle}
                          </Text>
                        </View>
                      </View>

                      <Badge
                        label={owned ? 'EQUIPPED / ACTIVE' : `${item.coinPrice} HC`}
                        color={owned ? 'emerald' : 'amber'}
                        variant={owned ? 'status' : 'outline'}
                      />
                    </View>

                    <Text variant="bodySecondary" color={colors.textPrimary} style={{ marginVertical: 8 }}>
                      {item.description}
                    </Text>

                    {/* Benefit Perks */}
                    <View style={[styles.perksBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                      {item.benefitPerks.map((perk, idx) => (
                        <View key={idx} style={styles.perkRow}>
                          <Ionicons name="checkmark-circle-outline" size={14} color={colors.emerald} />
                          <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 6, flex: 1 }}>
                            {perk}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Card Footer */}
                    <View style={styles.itemFooter}>
                      <View style={styles.cashEquivalentRow}>
                        <Text variant="caption" color={colors.textMuted}>Value: </Text>
                        <Text variant="caption" weight="bold" color={colors.emerald}>{item.cashEquivalentIdr}</Text>
                      </View>

                      {owned ? (
                        <View style={[styles.claimedTag, { backgroundColor: `${colors.emerald}15`, borderColor: colors.emerald }]}>
                          <Ionicons name="shield-checkmark" size={16} color={colors.emerald} />
                          <Text variant="mono" weight="bold" color={colors.emerald} style={{ marginLeft: 6, fontSize: 11 }}>
                            CLAIMED & ACTIVE
                          </Text>
                        </View>
                      ) : (
                        <Button
                          title={canAfford ? `REDEEM (-${item.coinPrice} HC)` : `INSUFFICIENT HC`}
                          variant={canAfford ? 'primary' : 'outline'}
                          size="sm"
                          leftIcon={<Ionicons name="shield" size={14} color={canAfford ? colors.textInverse : colors.textMuted} />}
                          onPress={() => handleRedeemItem(item)}
                          disabled={!canAfford}
                        />
                      )}
                    </View>
                  </TacticalCard>
                );
              })}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerTitleRow: {
    marginBottom: 8,
  },
  balancesCard: {
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
  },
  dividerVertical: {
    width: 1,
    height: '80%',
    marginHorizontal: 12,
  },
  coinValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  protocolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaultStatsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statCardHalf: {
    flex: 1,
    padding: 12,
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
    marginBottom: 6,
  },
  txMetaGrid: {
    gap: 2,
  },
  releaseActionRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  itemCard: {
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  itemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perksBox: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
    marginBottom: 10,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  cashEquivalentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
});
