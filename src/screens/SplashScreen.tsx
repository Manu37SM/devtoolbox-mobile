import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spectrum } from '@/theme/colors';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        {spectrum.map((c) => (
          <View key={c} style={[styles.dot, { backgroundColor: c }]} />
        ))}
      </View>
      <Text style={styles.title}>DevToolbox</Text>
      <Text style={styles.subtitle}>Every tool you need. One toolbox.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
  },
});
