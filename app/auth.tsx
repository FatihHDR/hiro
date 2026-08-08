import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';
import { useAppState, UserRole } from '../context/AppStateContext';
import {
  Text,
  TacticalCard,
  Input,
  Button,
  SegmentedControl,
  Divider,
} from '../components/ui';

export default function AuthScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { login, register } = useAppState();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<UserRole>('hero');

  // Form fields
  const [name, setName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [email, setEmail] = useState('alex.vance@hiro.tech');
  const [password, setPassword] = useState('••••••••');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      setErrorMsg('Please enter valid email and password credentials.');
      return;
    }

    if (mode === 'LOGIN') {
      login(email, role);
      router.back();
    } else {
      if (!name || !callsign) {
        setErrorMsg('Full Name and Tactical Callsign are required for registration.');
        return;
      }
      register(name, callsign, email, role);
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.topBar, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text variant="h3" style={{ marginLeft: 12 }}>HIRO TACTICAL AUTHENTICATION</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Auth Mode Toggle */}
        <SegmentedControl
          options={[
            { value: 'LOGIN', label: 'SIGN IN' },
            { value: 'REGISTER', label: 'NEW OPERATOR REGISTRATION' },
          ]}
          selectedValue={mode}
          onSelect={(val) => setMode(val as any)}
          style={{ marginBottom: 16 }}
        />

        <TacticalCard accent={role === 'hero' ? 'cyan' : 'emerald'} elevated style={{ marginBottom: 16 }}>
          <Text variant="caption" weight="bold" color={colors.textMuted} style={{ marginBottom: 8 }}>
            SELECT OPERATING ROLE
          </Text>

          <SegmentedControl
            options={[
              {
                value: 'citizen',
                label: 'Citizen Client',
                icon: <Ionicons name="person" size={14} color={role === 'citizen' ? colors.primary : colors.textSecondary} />,
              },
              {
                value: 'hero',
                label: 'Hero Specialist',
                icon: <Ionicons name="shield-checkmark" size={14} color={role === 'hero' ? colors.primary : colors.textSecondary} />,
              },
            ]}
            selectedValue={role}
            onSelect={(r) => setRole(r as UserRole)}
          />

          <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 10 }}>
            {role === 'hero'
              ? 'Hero Mode: Access Tactical War Room, accept Misi beacons, gain XP, earn Hero Coins & Escrow payouts.'
              : 'Citizen Mode: Post mission beacons, trigger Gate Break emergency dispatch, and manage Escrow payments.'}
          </Text>
        </TacticalCard>

        <Divider label={`// ${mode === 'LOGIN' ? 'ENTER CREDENTIALS' : 'OPERATOR DATA'}`} />

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
              placeholder="e.g. SPECTRE-09"
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

        <Input
          label="ACCESS PASSWORD"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          errorText={errorMsg}
          leftIcon={<Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />}
        />

        <Button
          title={mode === 'LOGIN' ? 'SIGN IN TO WAR ROOM' : 'CREATE OPERATOR ACCOUNT'}
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
          onPress={handleSubmit}
          style={{ marginTop: 12, marginBottom: 16 }}
        />

        <TacticalCard style={styles.demoBox}>
          <Text variant="caption" weight="semibold" color={colors.primary} style={{ marginBottom: 4 }}>
            QUICK DEMO PRESET CREDENTIALS:
          </Text>
          <Text variant="caption" color={colors.textSecondary}>
            Email: alex.vance@hiro.tech • Callsign: SPECTRE-07 (Elite Hero Level 14)
          </Text>
        </TacticalCard>
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
  demoBox: {
    padding: 12,
  },
});
