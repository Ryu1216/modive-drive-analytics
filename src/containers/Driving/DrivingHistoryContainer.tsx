import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import DrivingHistoryScreen from '../../screens/Driving/DrivingHistoryScreen';
import { DriveHistoryItem } from '../../types/driving';

// 임시 데이터 유지
const mockDriveHistory: DriveHistoryItem[] = [
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
];

const DrivingHistoryContainer = () => {
  const [driveHistory, setDriveHistory] = useState<DriveHistoryItem[]>([]);
  const navigation = useNavigation<any>();
  
  // 데이터 로드
  useEffect(() => {
    console.log('Container mounted, loading data...');
    const fetchData = async () => {
      try {
        // 실제 앱에서는 API 호출: const response = await api.getDrivingHistory();
        setDriveHistory(mockDriveHistory);
        console.log('Data loaded successfully:', mockDriveHistory.length, '항목');
      } catch (error) {
        console.error("데이터 로드 오류:", error);
        setDriveHistory([]);
      }
    };
    
    fetchData();
  }, []);
  
  // 주행 상세 화면으로 이동 - 이 부분이 중요합니다
  const handleDriveItemPress = (driveId: string) => {
    console.log('주행 기록 클릭:', driveId);
    navigation.navigate('DrivingDetail', { drivingId: driveId });
  };
  
  return (
    <DrivingHistoryScreen 
      driveHistory={driveHistory}
      handleDriveItemPress={handleDriveItemPress}
    />
  );
};

export default DrivingHistoryContainer;