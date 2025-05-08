import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';

// 화면 너비 구하기
const windowWidth = Dimensions.get('window').width;

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

export default function DrivingHistoryScreen() {
  // 피그마 디자인에 있는 샘플 데이터와 일치하도록 설정
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
  
  const navigation = useNavigation();
  
  const renderDriveHistoryItem = ({ item }: { item: DriveHistoryItem }) => {
    return (
      <TouchableOpacity 
        style={styles.historyItemContainer}
        onPress={() => console.log(`주행 기록 ${item.driveId} 선택됨`)}
      >
        <View style={styles.historyItem}>
          <View style={styles.leftContent}>
            <Text style={styles.dateTimeText}>
              {formatDate(item.date)}
            </Text>
            <Text style={styles.dateTimeText}>
              {formatTime(item.startTime, item.endTime)}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.summaryScore.toFixed(2)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <CustomHeader leftType="logo" title="" />
      
      <View style={styles.container}>
        <Text style={styles.title}>주행 히스토리</Text>
        
        <View style={styles.listHeaderContainer}>
          <Text style={styles.listHeaderLeft}>주행일시</Text>
          <Text style={styles.listHeaderRight}>주행점수</Text>
        </View>
        
        <View style={styles.divider} />
        
        <FlatList
          data={driveHistory}
          renderItem={renderDriveHistoryItem}
          keyExtractor={item => item.driveId}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>주행 기록이 없습니다.</Text>
            </View>
          )}
        />
        
        {/* 피그마 디자인에 맞게 하단 페이지 인디케이터 영역 구현 */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>지금까지의 주행데이터를 확인하세요</Text>
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
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
    paddingTop: 10,
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    color: '#4945FF',
    marginBottom: 20,
    fontWeight: '700',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  listHeaderLeft: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  listHeaderRight: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'right',
  },
  divider: {
    height: 4,
    backgroundColor: '#000000',
    marginBottom: 15,
    width: '100%',
  },
  listContainer: {
    flexGrow: 1, // FlatList가 남은 공간을 모두 차지하도록 설정
    paddingBottom: 20,
  },
  historyItemContainer: {
    marginBottom: 10,
    width: '100%',
  },
  historyItem: {
    backgroundColor: '#F2F2FF',
    borderRadius: 15,
    padding: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  leftContent: {
    flex: 1,
  },
  dateTimeText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    fontWeight: '600',
  },
  scoreContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#000000',
    textAlign: 'right',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#000000',
    marginBottom: 15,
    fontWeight: '400',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
    marginHorizontal: 4,
    opacity: 0.3,
  },
  activeIndicator: {
    opacity: 1,
  },
});