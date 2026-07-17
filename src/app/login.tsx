import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BrandColor, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.replace('/dashboard');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.form}>
          <ThemedView style={styles.brand}>
            <ThemedText type="title" style={styles.brandTitle}>
              HaloGold
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.centerText}>
              Investasi dan tabungan emas digital, mudah dan terpercaya.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.fields}>
            <ThemedView style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">
                Email
              </ThemedText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="nama@email.com"
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
              />
            </ThemedView>

            <ThemedView style={styles.field}>
              <ThemedText type="small" themeColor="textSecondary">
                Kata Sandi
              </ThemedText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Minimal 4 karakter"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
                autoComplete="password"
                style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
              />
            </ThemedView>

            {error ? (
              <ThemedText type="small" style={styles.error}>
                {error}
              </ThemedText>
            ) : null}
          </ThemedView>

          <Pressable
            onPress={handleLogin}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}>
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText style={styles.buttonText}>Masuk</ThemedText>
            )}
          </Pressable>

          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            Gunakan email &amp; kata sandi apa saja (min. 4 karakter) untuk mencoba aplikasi ini.
          </ThemedText>
        </KeyboardAvoidingView>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  form: {
    gap: Spacing.five,
  },
  brand: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  brandTitle: {
    fontSize: 40,
  },
  centerText: {
    textAlign: 'center',
  },
  fields: {
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  error: {
    color: '#D64545',
  },
  button: {
    backgroundColor: BrandColor,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
