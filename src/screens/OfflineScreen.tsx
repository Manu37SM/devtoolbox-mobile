import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spectrum } from '@/theme/colors';

type Props = {
  onRetry: () => void;

  httpError?: boolean;
};

export default function OfflineScreen({ onRetry, httpError }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        {spectrum.map((c) => (
          <View key={c} style={[styles.dot, { backgroundColor: c }]} />
        ))}
      </View>
      <Text style={styles.title}>
        {httpError ? "Couldn't load DevToolbox" : "You're offline"}
      </Text>
      <Text style={styles.subtitle}>
        {httpError
          ? 'The site returned an error. It may be temporarily down.'
          : 'Check your connection and try again. Most DevToolbox tools run entirely on your device once loaded, but the app itself needs a connection to load the site.'}
      </Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    opacity: 0.5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
