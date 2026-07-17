import { Redirect, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandColor, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAuthStore } from "@/store/auth-store";
import { MINIMUM_PURCHASE_NOMINAL, useGoldStore } from "@/store/gold-store";
import { formatGram, formatRupiah, parseNominalInput } from "@/utils/format";

const QUICK_AMOUNTS = [50_000, 100_000, 250_000, 500_000];

export default function BuyGoldScreen() {
  const router = useRouter();
  const theme = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { pricePerGram, buyGold } = useGoldStore();

  const [rawNominal, setRawNominal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nominal = parseNominalInput(rawNominal);
  const gram = useMemo(
    () => (nominal > 0 ? nominal / pricePerGram : 0),
    [nominal, pricePerGram],
  );

  // Route guard: buying gold requires an authenticated session.
  // (Declared after all hooks so hook order stays stable across renders.)
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const isBelowMinimum = nominal > 0 && nominal < MINIMUM_PURCHASE_NOMINAL;
  const canConfirm = nominal >= MINIMUM_PURCHASE_NOMINAL && !isSubmitting;

  const handleNominalChange = (value: string) => {
    setRawNominal(String(parseNominalInput(value)));
  };

  const handleConfirm = () => {
    if (!canConfirm) return;

    setIsSubmitting(true);
    const transaction = buyGold(nominal);
    setIsSubmitting(false);

    Alert.alert(
      "Pembelian Berhasil",
      `Kamu berhasil membeli ${formatGram(transaction.gram)} senilai ${formatRupiah(
        transaction.nominal,
      )}.`,
      [{ text: "OK", onPress: () => router.replace("/dashboard") }],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
        >
          <ThemedText type="linkPrimary">← Kembali</ThemedText>
        </Pressable>

        <ThemedText type="subtitle">Beli Emas</ThemedText>
        <ThemedText themeColor="textSecondary">
          Harga saat ini {formatRupiah(pricePerGram)} / gram
        </ThemedText>

        <ThemedView style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Nominal (Rp)
          </ThemedText>
          <TextInput
            value={nominal ? nominal.toLocaleString("id-ID") : ""}
            onChangeText={handleNominalChange}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
          />
          {isBelowMinimum ? (
            <ThemedText type="small" style={styles.warning}>
              Nominal pembelian minimal {formatRupiah(MINIMUM_PURCHASE_NOMINAL)}
              .
            </ThemedText>
          ) : null}
        </ThemedView>

        <ThemedView style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map((amount) => (
            <Pressable
              key={amount}
              onPress={() => setRawNominal(String(amount))}
              style={({ pressed }) => [
                styles.quickAmountChip,
                { backgroundColor: theme.backgroundElement },
                pressed && styles.quickAmountChipPressed,
              ]}
            >
              <ThemedText type="small">{formatRupiah(amount)}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.summaryCard}>
          <ThemedText type="small" themeColor="textSecondary">
            Estimasi Emas Didapat
          </ThemedText>
          <ThemedText type="title" style={styles.summaryGram}>
            {formatGram(gram)}
          </ThemedText>
        </ThemedView>

        <Pressable
          onPress={handleConfirm}
          disabled={!canConfirm}
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
            !canConfirm && styles.confirmButtonDisabled,
          ]}
        >
          <ThemedText style={styles.confirmButtonText}>
            Konfirmasi Pembelian
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  field: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 20,
    fontWeight: "600",
  },
  warning: {
    color: "#D64545",
  },
  quickAmounts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  quickAmountChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  quickAmountChipPressed: {
    opacity: 0.7,
  },
  summaryCard: {
    marginTop: Spacing.two,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  summaryGram: {
    fontSize: 30,
    lineHeight: 36,
  },
  confirmButton: {
    marginTop: "auto",
    backgroundColor: BrandColor,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
