import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';
import { useHaptics } from '../hooks/useHaptics';
import { useAppState, UserRole } from '../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Input,
  Button,
  SegmentedControl,
  Badge,
  Divider,
  ParticlesBackground,
} from '../components/ui';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { trigger } = useHaptics();
  const router = useRouter();
  const { login, register } = useAppState();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<UserRole>('hero');

  // Form fields
  const [name, setName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [email, setEmail] = useState('alex.vance@hiro.tech');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) {
      trigger('error');
      setErrorMsg('Masukkan alamat email dan password yang valid.');
      return;
    }

    setIsLoading(true);
    trigger('selection');

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'LOGIN') {
        login(email, role);
        trigger('success');
        router.back();
      } else {
        if (!name || !callsign) {
          trigger('error');
          setErrorMsg('Nama Lengkap dan Callsign Taktis wajib diisi untuk registrasi.');
          return;
        }
        register(name, callsign, email, role);
        trigger('success');
        router.back();
      }
    }, 800);
  };

  const handleQuickDemoLogin = (demoRole: UserRole) => {
    trigger('selection');
    setRole(demoRole);
    if (demoRole === 'hero') {
      setEmail('alex.vance@hiro.tech');
    } else {
      setEmail('client@citizencare.id');
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(demoRole === 'hero' ? 'alex.vance@hiro.tech' : 'client@citizencare.id', demoRole);
      trigger('success');
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* 21st.dev Ambient Particles & Radial Glow Layer */}
      <ParticlesBackground quantity={32} />

      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border, backgroundColor: 'rgba(8, 14, 23, 0.7)' }]}>
        <Pressable
          onPress={() => {
            trigger('light');
            router.back();
          }}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.topBarTitle}>
          <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
          <Text variant="h3" color={colors.primary} style={{ marginLeft: 8, fontSize: 13.5 }}>
            HIRO TACTICAL AUTHENTICATION
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Hero Box (21st.dev Style) */}
        <View style={styles.brandHeroBox}>
          <View style={[styles.heroLogoRing, { borderColor: `${colors.primary}60`, backgroundColor: `${colors.primary}18`, shadowColor: colors.primary }]}>
            <Ionicons name="shield-checkmark" size={34} color={colors.primary} />
          </View>
          <Text variant="h1" mono color={colors.primary} style={styles.heroBrandText}>
            HIRO // ID
          </Text>
          <Text variant="caption" color={colors.textSecondary} style={styles.heroSubText}>
            21ST.DEV GLASSMORPHIC AUTHENTICATION PROTOCOL
          </Text>
        </View>

        {/* Auth Mode Toggle (Sign In vs Register) */}
        <SegmentedControl
          options={[
            { value: 'LOGIN', label: 'SIGN IN' },
            { value: 'REGISTER', label: 'NEW OPERATOR REGISTER' },
          ]}
          selectedValue={mode}
          onSelect={(val) => {
            trigger('selection');
            setMode(val as any);
            setErrorMsg('');
          }}
          style={{ marginBottom: 14 }}
        />

        {/* 21st.dev Social Sign-In Providers Row */}
        <View style={styles.socialRow}>
          <Pressable
            onPress={() => {
              trigger('light');
              handleQuickDemoLogin('hero');
            }}
            style={({ pressed }) => [
              styles.socialBtn,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="logo-google" size={16} color={colors.textPrimary} />
            <Text variant="caption" weight="semibold" style={{ marginLeft: 6 }}>Google</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              trigger('light');
              handleQuickDemoLogin('citizen');
            }}
            style={({ pressed }) => [
              styles.socialBtn,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="logo-apple" size={16} color={colors.textPrimary} />
            <Text variant="caption" weight="semibold" style={{ marginLeft: 6 }}>Apple ID</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              trigger('light');
              handleQuickDemoLogin('hero');
            }}
            style={({ pressed }) => [
              styles.socialBtn,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="finger-print-outline" size={16} color={colors.primary} />
            <Text variant="caption" weight="semibold" color={colors.primary} style={{ marginLeft: 6 }}>Passkey</Text>
          </Pressable>
        </View>

        <Divider label="OR CONTINUE WITH TACTICAL DOSSIER" />

        {/* Role Selector Card with Dual Options */}
        <Text variant="caption" weight="bold" color={colors.textMuted} style={{ marginBottom: 6 }}>
          {'// 1. SELECT OPERATING IDENTITY'}
        </Text>

        <View style={styles.roleCardGrid}>
          {/* Hero Specialist Role */}
          <Pressable
            onPress={() => {
              trigger('selection');
              setRole('hero');
            }}
            style={({ pressed }) => [
              styles.roleSelectCard,
              {
                backgroundColor: role === 'hero' ? `${colors.primary}20` : colors.surface,
                borderColor: role === 'hero' ? colors.primary : colors.border,
                shadowColor: role === 'hero' ? colors.primary : 'transparent',
              },
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={styles.roleCardTop}>
              <View style={[styles.roleIconBadge, { backgroundColor: `${colors.primary}25`, borderColor: colors.primary }]}>
                <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
              </View>
              {role === 'hero' && <Badge label="SELECTED" color="cyan" variant="status" />}
            </View>
            <Text variant="body" weight="bold" color={role === 'hero' ? colors.primary : colors.textPrimary} style={{ marginTop: 8 }}>
              Hero Specialist
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 10, marginTop: 2 }}>
              War Room, Beacons, XP Rank, Hero Coins & Payouts.
            </Text>
          </Pressable>

          {/* Citizen Client Role */}
          <Pressable
            onPress={() => {
              trigger('selection');
              setRole('citizen');
            }}
            style={({ pressed }) => [
              styles.roleSelectCard,
              {
                backgroundColor: role === 'citizen' ? `${colors.emerald}20` : colors.surface,
                borderColor: role === 'citizen' ? colors.emerald : colors.border,
                shadowColor: role === 'citizen' ? colors.emerald : 'transparent',
              },
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={styles.roleCardTop}>
              <View style={[styles.roleIconBadge, { backgroundColor: `${colors.emerald}25`, borderColor: colors.emerald }]}>
                <Ionicons name="person" size={18} color={colors.emerald} />
              </View>
              {role === 'citizen' && <Badge label="SELECTED" color="emerald" variant="status" />}
            </View>
            <Text variant="body" weight="bold" color={role === 'citizen' ? colors.emerald : colors.textPrimary} style={{ marginTop: 8 }}>
              Citizen Client
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={{ fontSize: 10, marginTop: 2 }}>
              Broadcast Beacons, Gate Break SOS, Escrow Vault.
            </Text>
          </Pressable>
        </View>

        {/* Credentials Form Section */}
        <Divider label={`// 2. ${mode === 'LOGIN' ? 'OPERATOR CREDENTIALS' : 'NEW REGISTRATION DOSSIER'}`} />

        {errorMsg ? (
          <View style={[styles.errorBox, { backgroundColor: `${colors.crimson}20`, borderColor: colors.crimson }]}>
            <Ionicons name="alert-circle" size={16} color={colors.crimson} />
            <Text variant="caption" color={colors.crimson} style={{ marginLeft: 6, flex: 1 }}>
              {errorMsg}
            </Text>
          </View>
        ) : null}

        {mode === 'REGISTER' && (
          <>
            <Input
              label="FULL LEGAL NAME"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Alex Vance"
              leftIcon={<Ionicons name="person-outline" size={16} color={colors.textSecondary} />}
            />

            <Input
              label="TACTICAL CALLSIGN"
              value={callsign}
              onChangeText={setCallsign}
              placeholder="e.g. SPECTRE-07"
              mono
              leftIcon={<Ionicons name="radio-outline" size={16} color={colors.primary} />}
            />
          </>
        )}

        <Input
          label="OPERATOR EMAIL"
          value={email}
          onChangeText={setEmail}
          placeholder="operator@hiro.tech"
          keyboardType="email-address"
          leftIcon={<Ionicons name="mail-outline" size={16} color={colors.textSecondary} />}
        />

        <View style={{ position: 'relative' }}>
          <Input
            label="ACCESS PASSWORD"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        {/* Remember Me & Forgot Password Row */}
        <View style={styles.rememberRow}>
          <Pressable
            onPress={() => {
              trigger('light');
              setRememberMe(!rememberMe);
            }}
            style={styles.rememberCheck}
          >
            <Ionicons
              name={rememberMe ? 'checkbox' : 'square-outline'}
              size={18}
              color={rememberMe ? colors.primary : colors.textMuted}
            />
            <Text variant="caption" color={colors.textSecondary} style={{ marginLeft: 6 }}>
              Remember this device
            </Text>
          </Pressable>

          <Pressable onPress={() => trigger('light')}>
            <Text variant="caption" weight="semibold" color={colors.primary}>
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        {/* Submit Button */}
        <Button
          title={
            isLoading
              ? 'AUTHENTICATING ENCRYPTED SESSION...'
              : mode === 'LOGIN'
              ? 'SIGN IN TO TACTICAL WAR ROOM'
              : 'INITIALIZE OPERATOR ACCOUNT'
          }
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
          onPress={handleSubmit}
          style={{ marginTop: 8, marginBottom: 14 }}
        />

        {/* Quick Demo Preset Credentials Box (21st.dev Bento Card) */}
        <TacticalCard accent="cyan" style={styles.demoCard}>
          <View style={styles.demoCardHeader}>
            <Ionicons name="flash" size={16} color={colors.primary} />
            <Text variant="caption" weight="bold" color={colors.primary} style={{ marginLeft: 6 }}>
              QUICK DEMO 1-TAP LOGIN PRESETS:
            </Text>
          </View>

          <View style={styles.demoPresetBtns}>
            <Button
              title="⚡ LOGIN AS SPECTRE-07 (ELITE HERO LVL 14)"
              variant="outline"
              size="sm"
              fullWidth
              onPress={() => handleQuickDemoLogin('hero')}
              style={{ marginBottom: 6 }}
            />
            <Button
              title="⚡ LOGIN AS CITIZEN CLIENT (DIRECT HIRE & SOS)"
              variant="secondary"
              size="sm"
              fullWidth
              onPress={() => handleQuickDemoLogin('citizen')}
            />
          </View>
        </TacticalCard>

        {/* Security Matrix Footer */}
        <View style={styles.securityFooter}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
          <Text variant="caption" mono color={colors.textMuted} style={{ marginLeft: 6, fontSize: 10 }}>
            {'256-BIT ESCROW ENCRYPTION // VERIFIED KYC PROTOCOL'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  brandHeroBox: {
    alignItems: 'center',
    marginVertical: 14,
  },
  heroLogoRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  heroBrandText: {
    fontSize: 26,
    letterSpacing: 2,
    fontWeight: '900',
  },
  heroSubText: {
    fontSize: 9.5,
    letterSpacing: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleCardGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  roleSelectCard: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  roleCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 36,
    padding: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  rememberCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoCard: {
    padding: 12,
    marginBottom: 16,
  },
  demoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  demoPresetBtns: {
    marginTop: 4,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
});
