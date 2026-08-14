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
import { SHOP_CATALOG, ShopItem, ShopCategory } from '../../constants/shopItems';
import {
  Text,
  TacticalCard,
  Button,
  Badge,
  Divider,
} from '../ui';

interface DualCurrencyShopModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DualCurrencyShopModal: React.FC<DualCurrencyShopModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const { user, redeemShopItem } = useAppState();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | ShopCategory>('ALL');
  const [successToast, setSuccessToast] = useState<string>('');

  const isPurchased = (itemId: string): boolean => {
    return user.purchasedShopItemIds.includes(itemId);
  };

  const filteredItems = SHOP_CATALOG.filter((item) => {
    if (categoryFilter === 'ALL') return true;
    return item.category === categoryFilter;
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
            { backgroundColor: colors.surface, borderColor: colors.amber },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.shopIconBox, { backgroundColor: `${colors.amber}20`, borderColor: colors.amber }]}>
                <Ionicons name="storefront" size={20} color={colors.amber} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text variant="h3" color={colors.amber}>
                  DUAL-CURRENCY REWARD SHOP
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  Professional Benefits & Profile Customization Exchange
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
            {/* Dual Currency Balances Card */}
            <TacticalCard accent="amber" elevated style={styles.balancesCard}>
              <View style={styles.balanceRow}>
                <View style={styles.balanceItem}>
                  <Text variant="caption" color={colors.textMuted}>DIGITAL REWARD CURRENCY</Text>
                  <View style={styles.coinValueRow}>
                    <Ionicons name="shield" size={18} color={colors.amber} />
                    <Text variant="h2" color={colors.amber} style={{ marginLeft: 6 }}>
                      {user.heroCoins} <Text variant="caption">HC</Text>
                    </Text>
                  </View>
                  <Text variant="caption" color={colors.textSecondary}>
                    Earned from 5★ mission ratings
                  </Text>
                </View>

                <View style={[styles.dividerVertical, { backgroundColor: colors.border }]} />

                <View style={styles.balanceItem}>
                  <Text variant="caption" color={colors.textMuted}>CASH ESCROW VAULT</Text>
                  <View style={styles.coinValueRow}>
                    <Ionicons name="wallet-outline" size={18} color={colors.emerald} />
                    <Text variant="h2" color={colors.emerald} style={{ marginLeft: 6 }}>
                      Rp {(user.escrowBalance / 1000).toFixed(0)}k
                    </Text>
                  </View>
                  <Text variant="caption" color={colors.textSecondary}>
                    Guaranteed fiat payout
                  </Text>
                </View>
              </View>
            </TacticalCard>

            {/* Success Toast */}
            {successToast ? (
              <View style={[styles.toastBox, { backgroundColor: `${colors.emerald}20`, borderColor: colors.emerald }]}>
                <Ionicons name="sparkles" size={18} color={colors.emerald} />
                <Text variant="caption" weight="bold" color={colors.emerald} style={{ marginLeft: 8, flex: 1 }}>
                  {successToast}
                </Text>
              </View>
            ) : null}

            {/* Category Filter Chips */}
            <Divider label="// REWARD CATALOG CATEGORIES" />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {[
                { id: 'ALL', label: 'ALL REWARDS' },
                { id: 'PROFESSIONAL_BENEFITS', label: 'PROFESSIONAL BENEFITS (DISCOUNT & INSURANCE)' },
                { id: 'PROFILE_CUSTOMIZATION', label: 'PROFILE CUSTOMIZATION (ANIMATIONS & BADGES)' },
              ].map((chip) => {
                const isActive = categoryFilter === chip.id;
                return (
                  <Pressable
                    key={chip.id}
                    onPress={() => {
                      trigger('light');
                      setCategoryFilter(chip.id as any);
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

            {/* Catalog Items */}
            {filteredItems.map((item) => {
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

                  {/* Benefit Perks List */}
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

                  {/* Card Action Footer */}
                  <View style={styles.itemFooter}>
                    <View style={styles.cashEquivalentRow}>
                      <Text variant="caption" color={colors.textMuted}>Cash Equivalent Value: </Text>
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
                        title={canAfford ? `REDEEM (-${item.coinPrice} HC)` : `INSUFFICIENT HC (${item.coinPrice} HC)`}
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
  shopIconBox: {
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
  balancesCard: {
    marginBottom: 12,
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
