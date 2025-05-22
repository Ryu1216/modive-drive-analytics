import React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SeedsSummaryCard from '../../components/Seeds/SeedsSummaryCard';
import SeedsHistoryList from '../../components/Seeds/SeedsHistoryList';
import {SeedHistoryRawItem} from '../../types/seeds';

type SeedsScreenProps = {
  seeds: {
    userId: string;
    balance: number;
    total: number;
  };
  seedsHistory: SeedHistoryRawItem[];
};

export default function SeedsScreen({seeds, seedsHistory}: SeedsScreenProps) {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#3b82f6', '#4f46e5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <SeedsSummaryCard balance={seeds.balance} total={seeds.total} />
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>적립/사용 내역</Text>
      </View>

      <View style={styles.listWrapper}>
        <SeedsHistoryList seedsHistory={seedsHistory} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  headerGradient: {
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  headerContent: {
    padding: 20,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  listWrapper: {
    paddingBottom: 32,
  },
});
