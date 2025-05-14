import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Polyline } from 'react-native-svg';

// 주행 기록 데이터 타입 정의
interface DriveHistoryItem {
  driveId: string;
  date: string;
  startTime: string;
  endTime: string;
  summaryScore: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  
  return `${year}/${month}/${day}(${dayOfWeek})`;
};

const formatTime = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const startHours = String(start.getHours()).padStart(2, '0');
  const startMinutes = String(start.getMinutes()).padStart(2, '0');
  const endHours = String(end.getHours()).padStart(2, '0');
  const endMinutes = String(end.getMinutes()).padStart(2, '0');
  
  // 소요 시간 계산 (분 단위)
  const durationMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  let durationText = '';
  if (hours > 0) {
    durationText = `${hours}시간 ${minutes}분`;
  } else {
    durationText = `${minutes}분`;
  }
  
  return `${startHours}:${startMinutes}~${endHours}:${endMinutes}(${durationText})`;
};

const colors = {
  primary: '#4945FF',
  neutralLight: '#F2F2FF',
  neutralDark: '#666666',
  timelineLine: '#D0D0D0',
  background: '#FFFFFF',
};

export default function DrivingHistoryScreen() {
  const [driveHistory, setDriveHistory] = useState<DriveHistoryItem[]>([
    {
      "driveId": "drive_001",
      "date": "2025-04-26",
      "startTime": "2025-04-26T15:33:00Z",
      "endTime": "2025-04-26T16:23:00Z",
      "summaryScore": 87.33
    },
    {
      "driveId": "drive_002",
      "date": "2025-04-26",
      "startTime": "2025-04-26T11:33:00Z",
      "endTime": "2025-04-26T12:43:00Z",
      "summaryScore": 57.33
    },
    {
      "driveId": "drive_003",
      "date": "2025-04-25",
      "startTime": "2025-04-25T15:33:00Z",
      "endTime": "2025-04-25T16:23:00Z",
      "summaryScore": 59.24
    },
    {
      "driveId": "drive_004",
      "date": "2025-04-25",
      "startTime": "2025-04-25T15:33:00Z",
      "endTime": "2025-04-25T16:23:00Z",
      "summaryScore": 60.63
    }
  ]);
  
  const navigation = useNavigation<any>();
  
  // Navigate to driving detail screen
  const handleDriveItemPress = (driveId: string) => {
    navigation.navigate('DrivingDetail', { drivingId: driveId });
  };
  
  const renderDriveHistoryItem = (item: DriveHistoryItem, index: number) => {
    return (
      <View key={item.driveId} style={styles.historyItemWrapper}>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineDot} />
        </View>
        
        <Pressable
          style={styles.historyItem}
          onPress={() => handleDriveItemPress(item.driveId)}
          android_ripple={{ color: colors.primary + '20' }}
          accessibilityRole="button"
          accessibilityLabel={`주행 ${formatDate(item.date)} 상세 보기`}
        >
          <View style={styles.leftContent}>
            <Text style={styles.dateText}>
              {formatDate(item.date)}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(item.startTime, item.endTime)}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.summaryScore.toFixed(2)}</Text>
          </View>
        </Pressable>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={[styles.container, /* ensure container unchanged */]}>   
        <Text style={styles.title}>주행 히스토리</Text>
        <Text style={styles.subtitle}>지금까지의 주행 데이터를 확인해 보세요</Text>
        
        {driveHistory.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 주행 기록이 없어요</Text>
          </View>
        )}
        
        <Svg width="100%" height={100} style={{ marginTop: 30, marginBottom: 40 }}>
          <Defs>
            <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4945FF" />
              <Stop offset="100%" stopColor="#6C63FF" />
            </LinearGradient>
          </Defs>
          <Polyline
            points="15,80 80,40 160,60 240,10"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        
        <View style={styles.listHeaderContainer}>
          <Text style={styles.listHeaderLeft}>        주행일시</Text>
          <Text style={styles.listHeaderRight}>주행점수</Text>
        </View>
        
        <View style={[styles.historyListContainer, { position: 'relative', marginTop: 20 }]}>
           <View style={styles.fullTimelineLine} />
           {driveHistory.map((item, index) => renderDriveHistoryItem(item, index))}
         </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: colors.neutralDark,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: colors.neutralDark,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  listHeaderLeft: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#000000',
    marginLeft: 30,
  },
  listHeaderRight: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#000000',
    marginRight: 10,
  },
  historyListContainer: {
    flex: 1,
  },
  historyItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 30,
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    zIndex: 2,
  },
  fullTimelineLine: {
    position: 'absolute',
    left: 15,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.timelineLine,
  },
  historyItem: {
    flex: 1,
    backgroundColor: colors.neutralLight,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftContent: {
    flex: 1,
  },
  dateText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: colors.neutralDark,
    lineHeight: 22,
    marginBottom: 6,
  },
  timeText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: colors.neutralDark,
  },
  scoreContainer: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  scoreText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 22,
    color: colors.primary,
    fontWeight: '700',
  },
});