import { useTranslation } from '@human-0/i18n';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

export default function TermsScreen() {
  const { t } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/TERMS.md');
        if (!res.ok) throw new Error('Failed to load Terms of Service');
        const text = await res.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Simple markdown-to-text rendering for now.
  // In the future you can swap in a proper markdown renderer.
  const renderMarkdown = (md: string) => {
    const lines = md.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) {
        return (
          <Text key={i} style={styles.h1}>
            {line.slice(2).trim()}
          </Text>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <Text key={i} style={styles.h2}>
            {line.slice(3).trim()}
          </Text>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <Text key={i} style={styles.h3}>
            {line.slice(4).trim()}
          </Text>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <Text key={i} style={styles.li}>
            • {line.slice(2).trim()}
          </Text>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <Text key={i} style={styles.blockquote}>
            {line.slice(2).trim()}
          </Text>
        );
      }
      if (line.trim() === '') {
        return <View key={i} style={styles.spacer} />;
      }
      // Plain paragraph
      return (
        <Text key={i} style={styles.p}>
          {line.trim()}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('legal.termsTitle', 'Terms of Service')}</Text>
        {loading ? (
          <Text style={styles.p}>Loading…</Text>
        ) : error ? (
          <Text style={styles.error}>Error: {error}</Text>
        ) : (
          renderMarkdown(content)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B10',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E6ECE8',
    marginBottom: 24,
    textAlign: 'center',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E6ECE8',
    marginTop: 24,
    marginBottom: 12,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E6ECE8',
    marginTop: 20,
    marginBottom: 10,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E6ECE8',
    marginTop: 16,
    marginBottom: 8,
  },
  p: {
    fontSize: 16,
    color: '#E6ECE8',
    lineHeight: 24,
    marginBottom: 12,
  },
  li: {
    fontSize: 16,
    color: '#E6ECE8',
    marginLeft: 20,
    marginBottom: 6,
    lineHeight: 22,
  },
  blockquote: {
    fontSize: 16,
    color: '#E6ECE8',
    fontStyle: 'italic',
    borderLeftWidth: 3,
    borderLeftColor: '#00FF9C',
    paddingLeft: 12,
    marginBottom: 12,
  },
  spacer: {
    height: 12,
  },
  error: {
    fontSize: 16,
    color: '#ff6b6b',
    marginBottom: 12,
  },
});
