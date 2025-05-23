import { create } from 'zustand';
import axios from 'axios';
import { DriveHistoryItem } from '../types/driving';

interface DrivingHistoryState {
  driveHistory: DriveHistoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchDriveHistory: () => Promise<void>;
  getDriveDetail: (driveId: string) => Promise<DriveHistoryItem | undefined>;
}

export const useDrivingHistoryStore = create<DrivingHistoryState>((set, get) => ({
  driveHistory: [],
  isLoading: false,
  error: null,
  
  fetchDriveHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const API_URL = __DEV__ 
        ? 'http://10.0.2.2:8080/dashboard/post-drive'
        : 'https://api.yourproductionurl.com/dashboard/post-drive';

      // 전체 응답 객체 확인 (더 많은 정보를 볼 수 있음)
      const response = await axios.get(API_URL, {
        headers: { 'X-User-Id': '1' }
      });
      
      console.log("API 응답 전체:", JSON.stringify(response));
      console.log("API 응답 상태:", response.status);
      console.log("API 응답 데이터:", response.data);
      
      // 응답이 구조화된 객체인지 확인하고 list 속성 확인
      const dataArray = response.data?.list
        ? Array.isArray(response.data.list) 
           ? response.data.list 
           : []
        : (Array.isArray(response.data) ? response.data : []);
      
      // 데이터가 비어있는 경우 명시적 처리
      if (dataArray.length === 0) {
        console.log("주행 기록 데이터가 없습니다");
        set({ driveHistory: [], isLoading: false });
        return;
      }
      
      // API 응답 형식에 맞게 데이터 변환
      const formattedData: DriveHistoryItem[] = dataArray.map((item: any) => ({
        driveId: item.driveId || item.id || '',
        date: item.startTime ? item.startTime.substring(0, 10) : '', // 날짜 추출
        startTime: item.startTime || '',
        endTime: item.endTime || '',
        summaryScore: item.score || 0
      }));
      
      set({ driveHistory: formattedData, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch drive history:", error);
      
      // 더 구체적인 에러 메시지 제공
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          set({ error: "요청 시간이 초과되었습니다. 네트워크를 확인해주세요.", isLoading: false });
        } else if (error.code === 'ERR_NETWORK') {
          set({ error: "서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.", isLoading: false });
        } else {
          set({ error: `API 오류: ${error.message}`, isLoading: false });
        }
      } else {
        set({ error: "알 수 없는 오류가 발생했습니다", isLoading: false });
      }
    }
  },
  
  getDriveDetail: async (driveId: string) => {
    const { driveHistory } = get();
    return driveHistory.find(item => item.driveId === driveId);
    
    // 필요한 경우 개별 드라이브 상세 정보를 위한 API 호출 추가
    // const response = await axios.get(`http://localhost:8080/dashboard/drive/${driveId}`);
    // return response.data;
  }
}));