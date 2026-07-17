import { Redirect, useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandColor, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useGold } from '@/context/gold-context';
import { formatGram, formatRupiah } from '@/utils/format';

export default function DashboardScreen() {
  const router = useRouter();
  const { isAuthenticated, userEmail, logout } = useAuth();
  const { balanceGram, pricePerGram } = useGold();

  // Route guard: only authenticated users may view the dashboard.
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const balanceValue = balanceGram * pricePerGram;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedView>
            <ThemedText type="small" themeColor="textSecondary">
              Selamat datang,
            </ThemedText>
            <ThemedText type="smallBold" numberOfLines={1}>
              {userEmail}
            </ThemedText>
          </ThemedView>
          <Pressable onPress={handleLogout} hitSlop={12}>
            <ThemedText type="linkPrimary">Keluar</ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.balanceCard}>
          <ThemedText themeColor="textSecondary" type="small">
            Saldo Emas
          </ThemedText>
          <ThemedText type="title" style={styles.balanceGram}>
            {formatGram(balanceGram)}
          </ThemedText>
          <ThemedText themeColor="textSecondary">≈ {formatRupiah(balanceValue)}</ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.priceCard}>
          <ThemedText themeColor="textSecondary" type="small">
            Harga Emas Hari Ini
          </ThemedText>
          <ThemedText type="subtitle">{formatRupiah(pricePerGram)}</ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            per gram · diperbarui realtime
          </ThemedText>
        </ThemedView>

        <Pressable
          onPress={() => router.push('/beli-emas')}
          style={({ pressed }) => [styles.buyButton, pressed && styles.buyButtonPressed]}>
          <ThemedText style={styles.buyButtonText}>Beli Emas</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  balanceGram: {
    fontSize: 34,
    lineHeight: 40,
  },
  priceCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  buyButton: {
    marginTop: 'auto',
    backgroundColor: BrandColor,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonPressed: {
    opacity: 0.85,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
