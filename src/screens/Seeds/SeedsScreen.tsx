import React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const formatTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
};

export default function SeedsScreen() {
  const rewardHistory = [
    {
      description: '주행 점수 보상',
      type: '적립',
      amount: 5,
      balance: 500,
      date: '2025-04-25T09:13:00',
    },
    {
      description: '주행 이벤트 보상',
      type: '적립',
      amount: 1,
      balance: 495,
      date: '2025-04-25T09:13:00',
    },
    {
      description: '할인 쿠폰 구매',
      type: '사용',
      amount: 10000,
      balance: 494,
      date: '2025-04-24T15:00:00',
    },
    {
      description: '출석보상',
      type: '적립',
      amount: 1,
      balance: 10494,
      date: '2025-04-24T15:00:00',
    },
  ];

  const renderListWithDateHeaders = () => {
    let lastDate: string | null = null;

    return rewardHistory.map((item, index) => {
      const displayDate = formatDate(item.date);
      const showDate = displayDate !== lastDate;
      lastDate = displayDate;

      return (
        <View key={index} style={{width: '100%'}}>
          {showDate && <Text style={styles.dateHeader}>{displayDate}</Text>}
          <View style={styles.cardItem}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>{item.description}</Text>
              <Text style={styles.cardSub}>{formatTime(item.date)}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={item.type === '적립' ? styles.plus : styles.minus}>
                {item.type === '적립' ? '+' : '-'}
                {item.amount}
              </Text>
              <Text style={styles.cardSub}>{item.balance}</Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#3b82f6', '#4f46e5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.seedSummaryCard}>
            <View style={styles.seedSummaryLabelContainer}>
              <Text style={styles.seedAvailableLabel}>사용 가능 씨앗</Text>
              <Text style={styles.seedAvailableCount}>500</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.seedSummaryLabelContainer}>
              <Text style={styles.seedTotalLabel}>총 사용 씨앗</Text>
              <Text style={styles.seedTotalCount}>14,300</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>적립/사용 내역</Text>
      </View>
      <View style={styles.listWrapper}>{renderListWithDateHeaders()}</View>
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
  seedSummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 20,
  },
  seedSummaryLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seedAvailableLabel: {
    fontSize: 16,
    color: 'white',
  },
  seedAvailableCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 12,
  },
  seedTotalLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  seedTotalCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
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
  dateHeader: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 8,
  },
  listWrapper: {
    paddingBottom: 32,
  },
  cardItem: {
    borderRadius: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // ← 상하 정렬 보정
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  cardRight: {
    alignItems: 'flex-end', // ← 오른쪽 정렬
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },
  cardSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  plus: {
    fontSize: 19,
    color: '#4C6EF5',
    fontWeight: 'bold',
  },
  minus: {
    fontSize: 19,
    color: '#888',
    fontWeight: 'bold',
  },
});
