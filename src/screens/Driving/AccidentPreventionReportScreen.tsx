import React, {useState, JSX} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, {Path, Circle, G, Text as SvgText, Line, Rect} from 'react-native-svg';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import HeaderDropdown from '../../components/common/HeaderDropdown';

// 색상 시스템 정의 - 보라색 테마
const COLORS = {
  primary: '#BB27FF', // 메인 컬러 - 보라색
  danger: '#FF5252',
  background: '#FFFFFF',
  cardBackground: '#FCFCFC',
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    light: '#718096',
  },
  border: '#E5E5E5',
  shadow: '#000000',
  success: '#BB27FF', // 메인 컬러와 동일
  chart: {
    green: '#68D392',
    red: '#E53E3E',
    orange: '#ED8936',
    purple: '#BB27FF', // 메인 컬러와 동일
    blue: '#4299E1',
    yellow: '#ECC94B',
    background: '#F9FAFC',
    grid: '#CBD5E0',
    lightGrid: 'rgba(203, 213, 224, 0.3)',
  },
  gradient: {
    purpleStart: 'rgba(187, 39, 255, 0.6)', // 메인 컬러 기반 그라데이션
    purpleEnd: 'rgba(187, 39, 255, 0.1)', // 메인 컬러 기반 그라데이션
    redStart: 'rgba(229, 62, 62, 0.6)',
    redEnd: 'rgba(229, 62, 62, 0.1)',
  },
};

// 화면 크기 가져오기
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// 반응형 차트 크기 계산
const chartConfig = {
  pieRadius: screenWidth * 0.35,
  pieInnerRadius: screenWidth * 0.18,
  gaugeSize: screenWidth * 0.6 > 240 ? 240 : screenWidth * 0.6,
  barWidth: screenWidth * 0.08 > 30 ? 30 : screenWidth * 0.08,
  barSpacing: screenWidth * 0.05 > 24 ? 24 : screenWidth * 0.05,
  lineChartWidth: screenWidth - 100 > 0 ? screenWidth - 100 : 300,
  lineChartHeight: Math.max(screenHeight * 0.28, 200),
};

// 사고 예방 점수 화면의 탭 - 변경됨
const options = ['반응속도', '차선이탈', '안전거리유지'];

interface GaugeChartProps {
  percentage: number;
  color: string;
  size?: number;
}

// 타임라인 점 마커 컴포넌트
const TimelineMarker = ({x, y, color, time}: {x: number; y: number; color: string; time: string}) => (
  <G>
    <Circle cx={x} cy={y} r={6} fill={color} />
    <SvgText x={x} y={y - 10} fontSize={8} fill={COLORS.text.secondary} textAnchor="middle">
      {time}
    </SvgText>
  </G>
);

// 데이터 포인트 컴포넌트
const EventDataPoint = ({value, time}: {value: string; time: string}) => (
  <View style={styles.eventDataPoint}>
    <Text style={styles.eventTime}>{time}</Text>
    <Text style={styles.eventValue}>{value}</Text>
  </View>
);

// 게이지 차트 컴포넌트
const GaugeChart = ({percentage, color, size = 180}: GaugeChartProps) => {
  const center = size / 2;
  const gaugeRadius = (size / 2) * 0.8;
  const strokeWidth = 20;

  // 게이지 각도 계산 - 반원형 차트 (180도)
  const gaugeStartAngle = -180;
  const gaugeEndAngle = gaugeStartAngle + (percentage / 100) * 180;

  // 극좌표를 데카르트 좌표로 변환
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleDegrees: number,
  ) => {
    const angleRad = (angleDegrees * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad),
    };
  };

  // 호 경로 생성
  const createArc = (
    x: number,
    y: number,
    r: number,
    startAng: number,
    endAng: number,
  ) => {
    const start = polarToCartesian(x, y, r, endAng);
    const end = polarToCartesian(x, y, r, startAng);
    const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      r,
      r,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  const foregroundArc = createArc(
    center,
    center,
    gaugeRadius,
    gaugeStartAngle,
    gaugeEndAngle,
  );
  const backgroundArc = createArc(
    center,
    center,
    gaugeRadius,
    gaugeStartAngle,
    gaugeStartAngle + 180,
  );

  const displayValue = percentage.toFixed(1);
  const ratingText =
    percentage >= 70 ? 'Good' : percentage >= 40 ? 'So-so' : 'Poor';

  // 반응형 폰트 크기 계산
  const scoreFontSize = size * 0.18 > 36 ? 36 : size * 0.18;
  const ratingFontSize = size * 0.12 > 24 ? 24 : size * 0.12;

  return (
    <View style={[styles.gaugeChartContainer, {height: size * 0.6}]}>
      <Svg width={size} height={size * 0.6}>
        {/* 배경 호 */}
        <Path
          d={backgroundArc}
          stroke="#f0d6ff" // 보라색 계열 배경
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* 전경 호 */}
        <Path
          d={foregroundArc}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* 게이지 끝 부분의 원 */}
        <Circle
          cx={polarToCartesian(center, center, gaugeRadius, gaugeEndAngle).x}
          cy={polarToCartesian(center, center, gaugeRadius, gaugeEndAngle).y}
          r={strokeWidth / 2}
          fill="#FFFFFF"
          stroke={color}
          strokeWidth={2}
        />

        {/* 점수 텍스트 */}
        <G x={center} y={center - 10}>
          <SvgText
            textAnchor="middle"
            fontSize={scoreFontSize}
            fontWeight="bold"
            fill={color}>
            {displayValue}
          </SvgText>
          <SvgText
            textAnchor="middle"
            fontSize={ratingFontSize}
            fontWeight="bold"
            fill={color}
            y={30}>
            {ratingText}
          </SvgText>
        </G>

        {/* 0과 100 표시 */}
        <SvgText x={10} y={center + 15} fontSize={12} fill={COLORS.text.light}>
          {'0'}
        </SvgText>
        <SvgText
          x={size - 22}
          y={center + 15}
          fontSize={12}
          fill={COLORS.text.light}>
          {'100'}
        </SvgText>
      </Svg>
    </View>
  );
};

// 타임라인 차트
const TimelineChart = ({
  events,
  title,
  height = 200,
  showMarkers = true,
}: {
  events: Array<{time: string; formattedTime: string}>;
  title: string;
  height?: number;
  showMarkers?: boolean;
}) => {
  const width = screenWidth - 80;
  
  // 시간을 분 단위로 변환
  const timeToMinutes = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.getHours() * 60 + date.getMinutes();
  };
  
  // 이벤트를 시간순으로 정렬
  const sortedEvents = [...events].sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );
  
  // 시작 시간과 종료 시간 찾기
  const startTime = timeToMinutes(sortedEvents[0].time);
  const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1].time);
  
  // 타임라인 시간 범위 (최소 60분)
  const timeRange = Math.max(endTime - startTime, 60);
  
  return (
    <View style={[styles.timelineContainer, { height }]}>
      <Text style={styles.timelineTitle}>{title}</Text>
      
      <Svg width={width} height={height - 40}>
        {/* 타임라인 기본선 */}
        <Line 
          x1={0} 
          y1={height / 2} 
          x2={width} 
          y2={height / 2} 
          stroke={COLORS.chart.grid} 
          strokeWidth={2} 
        />
        
        {/* 시간 눈금 (30분 간격) */}
        {Array.from({ length: Math.ceil(timeRange / 30) + 1 }).map((_, i) => {
          const tickTime = startTime + i * 30;
          const tickX = ((tickTime - startTime) / timeRange) * width;
          const hours = Math.floor(tickTime / 60);
          const minutes = tickTime % 60;
          const timeLabel = `${hours}:${minutes.toString().padStart(2, '0')}`;
          
          return (
            <G key={`tick-${i}`}>
              <Line 
                x1={tickX} 
                y1={height / 2 - 5} 
                x2={tickX} 
                y2={height / 2 + 5} 
                stroke={COLORS.chart.grid} 
                strokeWidth={1} 
              />
              <SvgText 
                x={tickX} 
                y={height / 2 + 20} 
                fontSize={10} 
                fill={COLORS.text.secondary}
                textAnchor="middle"
              >
                {timeLabel}
              </SvgText>
            </G>
          );
        })}
        
        {/* 이벤트 마커 */}
        {showMarkers && sortedEvents.map((event, index) => {
          const eventTime = timeToMinutes(event.time);
          const eventX = ((eventTime - startTime) / timeRange) * width;
          
          return (
            <TimelineMarker 
              key={`marker-${index}`} 
              x={eventX} 
              y={height / 2} 
              color={COLORS.chart.purple}
              time={event.formattedTime}
            />
          );
        })}
      </Svg>
    </View>
  );
};

// 반응속도 차트 컴포넌트 - 새로 추가
const ReactionSpeedChart = ({ events, height = 200 }) => {
  const width = screenWidth - 80;
  const chartHeight = height - 40;
  
  // 시간을 분 단위로 변환
  const timeToMinutes = (timeStr) => {
    const date = new Date(timeStr);
    return date.getHours() * 60 + date.getMinutes();
  };
  
  // 정렬된 이벤트
  const sortedEvents = [...events].sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );
  
  // 시작/종료 시간
  const startTime = timeToMinutes(sortedEvents[0]?.time) || 0;
  const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) || startTime + 60;
  const timeRange = Math.max(endTime - startTime, 60);
  
  // 반응 시간 데이터 포인트 생성 (시뮬레이션)
  const generateDataPoints = () => {
    const points = [];
    const numPoints = 50; // 데이터 포인트 수
    
    for (let i = 0; i < numPoints; i++) {
      const minute = startTime + (timeRange * i / (numPoints - 1));
      
      // 이벤트 발생 근처에서는 반응 시간 높게 설정
      const isNearEvent = sortedEvents.some(event => {
        const eventMinute = timeToMinutes(event.time);
        return Math.abs(eventMinute - minute) < 2;
      });
      
      // 반응 시간 값 (낮을수록 좋음, 높을수록 나쁨) - 시뮬레이션
      // 0-1 사이 값으로 정규화 (0이 가장 좋음, 1이 가장 나쁨)
      const value = isNearEvent ? 
        0.8 + Math.random() * 0.2 : // 이벤트 근처: 높은 반응 시간 (나쁨)
        0.2 + Math.random() * 0.4;  // 일반 상황: 낮은-중간 반응 시간
        
      const x = ((minute - startTime) / timeRange) * width;
      const y = chartHeight - (value * (chartHeight - 30)) - 10; // 위쪽이 좋은 값
      
      points.push({ x, y, minute, value });
    }
    return points;
  };
  
  const dataPoints = generateDataPoints();
  
  // SVG 경로 생성
  const createLinePath = () => {
    return dataPoints.map((point, index) => 
      (index === 0 ? 'M' : 'L') + point.x + ',' + point.y
    ).join(' ');
  };
  
  return (
    <View style={[styles.chartSpecialContainer, { height }]}>
      <Text style={styles.chartTitle}>반응 속도 변화 추이</Text>
      
      <Svg width={width} height={chartHeight}>
        {/* 배경 격자 */}
        <Line 
          x1={0} y1={chartHeight - 10}
          x2={width} y2={chartHeight - 10}
          stroke={COLORS.chart.grid} strokeWidth={1}
        />
        <Line 
          x1={0} y1={(chartHeight - 10) * 0.5}
          x2={width} y2={(chartHeight - 10) * 0.5}
          stroke={COLORS.chart.lightGrid} strokeWidth={1}
          strokeDasharray="5,5"
        />
        
        {/* 위험 구간 표시 */}
        <Rect 
          x={0} y={0} 
          width={width} 
          height={(chartHeight - 10) * 0.3}
          fill="rgba(229, 62, 62, 0.1)" 
        />
        <SvgText 
          x={8} y={20} 
          fill={COLORS.chart.red} 
          fontSize={11}
        >
          위험 구간
        </SvgText>
        
        {/* 반응 시간 선 그래프 */}
        <Path 
          d={createLinePath()} 
          stroke={COLORS.chart.purple}
          strokeWidth={3}
          fill="none"
        />
        
        {/* 이벤트 발생 지점 표시 */}
        {sortedEvents.map((event, index) => {
          const eventMinute = timeToMinutes(event.time);
          const x = ((eventMinute - startTime) / timeRange) * width;
          
          return (
            <G key={`event-${index}`}>
              <Line 
                x1={x} y1={0} 
                x2={x} y2={chartHeight - 10} 
                stroke={COLORS.chart.red}
                strokeWidth={2}
                strokeDasharray="3,3"
              />
              <Circle 
                cx={x} cy={10} 
                r={6} 
                fill={COLORS.chart.red} 
              />
              <SvgText 
                x={x} y={chartHeight}
                fontSize={10}
                fill={COLORS.text.secondary}
                textAnchor="middle"
              >
                {event.formattedTime}
              </SvgText>
            </G>
          );
        })}
        
        {/* 라벨 */}
        <SvgText x={8} y={chartHeight - 15} fontSize={10} fill={COLORS.text.light}>
          좋음
        </SvgText>
        <SvgText x={8} y={20} fontSize={10} fill={COLORS.chart.red}>
          나쁨
        </SvgText>
      </Svg>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.chart.purple }]} />
          <Text style={styles.legendText}>반응 시간 추이</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.chart.red }]} />
          <Text style={styles.legendText}>위험 이벤트</Text>
        </View>
      </View>
    </View>
  );
};

// 차선이탈 시각화 컴포넌트 - 새로 추가
const LaneDepartureChart = ({ events, height = 200 }) => {
  const width = screenWidth - 80;
  const chartHeight = height - 40;
  const laneHeight = 40;
  const roadHeight = laneHeight * 3; // 3개 차선
  const roadY = (chartHeight - roadHeight) / 2;
  
  // 시간을 분 단위로 변환
  const timeToMinutes = (timeStr) => {
    const date = new Date(timeStr);
    return date.getHours() * 60 + date.getMinutes();
  };
  
  // 정렬된 이벤트
  const sortedEvents = [...events].sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );
  
  // 시작/종료 시간
  const startTime = timeToMinutes(sortedEvents[0]?.time) || 0;
  const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) || startTime + 60;
  const timeRange = Math.max(endTime - startTime, 60);
  
  // 가상의 차선 움직임 (왼쪽/오른쪽 이탈 시뮬레이션)
  const generateCarPath = () => {
    const points = [];
    const segments = 100;
    const centerY = roadY + laneHeight * 1.5; // 도로 중앙
    
    for (let i = 0; i < segments; i++) {
      const x = (width * i) / (segments - 1);
      let y = centerY;
      
      // 이벤트 발생 근처에서는 차선 이탈 시뮬레이션
      const progress = i / segments;
      const currentTime = startTime + timeRange * progress;
      
      const nearestEvent = sortedEvents.find(event => {
        const eventMinute = timeToMinutes(event.time);
        return Math.abs(eventMinute - currentTime) < 1;
      });
      
      if (nearestEvent) {
        // 이벤트 발생 위치에서 차선 이탈 (위 또는 아래)
        const isLeftDeparture = Math.random() > 0.5; // 50% 확률로 왼쪽/오른쪽 차선 이탈
        const offset = isLeftDeparture ? -laneHeight : laneHeight;
        
        // 이탈 시작과 복귀를 부드럽게
        const eventMinute = timeToMinutes(nearestEvent.time);
        const distanceFromEvent = Math.abs(eventMinute - currentTime);
        
        if (distanceFromEvent < 0.8) {
          // 가우시안 커브 형태로 이탈 (1에 가까울수록 중앙에서 멀어짐)
          const deviation = Math.exp(-Math.pow(distanceFromEvent * 2, 2));
          y += offset * deviation;
        }
      }
      
      points.push({ x, y });
    }
    
    return points;
  };
  
  const carPathPoints = generateCarPath();
  
  // SVG 경로 생성
  const createCarPath = () => {
    return carPathPoints.map((point, index) => 
      (index === 0 ? 'M' : 'L') + point.x + ',' + point.y
    ).join(' ');
  };
  
  return (
    <View style={[styles.chartSpecialContainer, { height }]}>
      <Text style={styles.chartTitle}>차선 이탈 시각화</Text>
      
      <Svg width={width} height={chartHeight}>
        {/* 도로 배경 */}
        <Rect 
          x={0} y={roadY} 
          width={width} height={roadHeight} 
          fill="#E2E8F0" 
        />
        
        {/* 차선 그리기 */}
        <Line 
          x1={0} y1={roadY + laneHeight} 
          x2={width} y2={roadY + laneHeight}
          stroke="white" strokeWidth={3} strokeDasharray="10,10"
        />
        <Line 
          x1={0} y1={roadY + laneHeight * 2} 
          x2={width} y2={roadY + laneHeight * 2}
          stroke="white" strokeWidth={3} strokeDasharray="10,10"
        />
        
        {/* 운전 경로 */}
        <Path 
          d={createCarPath()} 
          stroke={COLORS.chart.purple}
          strokeWidth={4}
          fill="none"
        />
        
        {/* 이벤트 발생 지점 표시 */}
        {sortedEvents.map((event, index) => {
          const eventMinute = timeToMinutes(event.time);
          const x = ((eventMinute - startTime) / timeRange) * width;
          const isLeftDeparture = index % 2 === 0; // 시뮬레이션: 짝/홀수 인덱스에 따라 왼쪽/오른쪽 이탈
          
          const iconY = isLeftDeparture ? 
            roadY - 10 : // 왼쪽 차선 이탈
            roadY + roadHeight + 10; // 오른쪽 차선 이탈
          
          return (
            <G key={`lane-event-${index}`}>
              <Circle cx={x} cy={iconY} r={8} fill={COLORS.chart.red} />
              <SvgText 
                x={x} 
                y={chartHeight} 
                fontSize={10}
                fill={COLORS.text.secondary}
                textAnchor="middle"
              >
                {event.formattedTime}
              </SvgText>
            </G>
          );
        })}
        
        {/* 시간 표시 */}
        <Line 
          x1={0} y1={chartHeight - 15} 
          x2={width} y2={chartHeight - 15}
          stroke={COLORS.chart.grid} strokeWidth={1}
        />
        
        {/* 차량 아이콘 */}
        <Circle 
          cx={carPathPoints[carPathPoints.length - 1].x - 5} 
          cy={carPathPoints[carPathPoints.length - 1].y} 
          r={8} 
          fill={COLORS.primary}
        />
      </Svg>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.chart.purple }]} />
          <Text style={styles.legendText}>차량 경로</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.chart.red }]} />
          <Text style={styles.legendText}>차선 이탈</Text>
        </View>
      </View>
    </View>
  );
};

// 안전거리 차트 컴포넌트 - 새로 추가
const SafeDistanceChart = ({ events, height = 200 }) => {
  const width = screenWidth - 80;
  const chartHeight = height - 40;
  
  // 시간을 분 단위로 변환
  const timeToMinutes = (timeStr) => {
    const date = new Date(timeStr);
    return date.getHours() * 60 + date.getMinutes();
  };
  
  // 정렬된 이벤트
  const sortedEvents = [...events].sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );
  
  // 시작/종료 시간
  const startTime = timeToMinutes(sortedEvents[0]?.time) || 0;
  const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) || startTime + 60;
  const timeRange = Math.max(endTime - startTime, 60);
  
  // 안전 거리 데이터 포인트 생성 (시뮬레이션)
  const generateDistanceData = () => {
    const points = [];
    const numPoints = 50;
    const safeDistance = chartHeight * 0.6; // 안전 거리 기준선
    
    for (let i = 0; i < numPoints; i++) {
      const minute = startTime + (timeRange * i / (numPoints - 1));
      let distance;
      
      // 이벤트 발생 근처에서는 안전거리 위반
      const isNearEvent = sortedEvents.some(event => {
        const eventMinute = timeToMinutes(event.time);
        return Math.abs(eventMinute - minute) < 2;
      });
      
      // 거리 값 시뮬레이션
      if (isNearEvent) {
        // 이벤트 근처: 안전거리보다 가까움 (위반)
        distance = safeDistance * (0.3 + Math.random() * 0.2);
      } else {
        // 일반 상황: 안전거리 이상
        distance = safeDistance * (0.8 + Math.random() * 0.5);
      }
      
      const x = ((minute - startTime) / timeRange) * width;
      const y = chartHeight - distance;
      
      points.push({ x, y, minute, distance });
    }
    return points;
  };
  
  const distanceData = generateDistanceData();
  
  // SVG 경로 생성
  const createDistancePath = () => {
    let path = distanceData.map((point, index) => 
      (index === 0 ? 'M' : 'L') + point.x + ',' + point.y
    ).join(' ');
    
    // 영역 채우기 위해 경로 닫기
    path += ` L${width},${chartHeight} L0,${chartHeight} Z`;
    return path;
  };
  
  const safeDistanceY = chartHeight * 0.4; // 안전 거리 기준선 (위에서부터)
  
  return (
    <View style={[styles.chartSpecialContainer, { height }]}>
      <Text style={styles.chartTitle}>차간 안전거리 변화</Text>
      
      <Svg width={width} height={chartHeight}>
        {/* 배경 영역: 안전/위험 구분 */}
        <Rect 
          x={0} y={0}
          width={width} height={safeDistanceY}
          fill="rgba(229, 62, 62, 0.1)" // 위험 영역: 빨간색
        />
        <Rect 
          x={0} y={safeDistanceY}
          width={width} height={chartHeight - safeDistanceY}
          fill="rgba(104, 211, 146, 0.1)" // 안전 영역: 녹색
        />
        
        {/* 안전 거리 기준선 */}
        <Line 
          x1={0} y1={safeDistanceY}
          x2={width} y2={safeDistanceY}
          stroke="#68D392" strokeWidth={2}
          strokeDasharray="5,5"
        />
        <SvgText 
          x={8} y={safeDistanceY - 5} 
          fill="#68D392" 
          fontSize={10}
        >
          권장 안전거리
        </SvgText>
        
        {/* 거리 변화 곡선 */}
        <Path 
          d={createDistancePath()}
          fill="rgba(187, 39, 255, 0.2)"
          stroke={COLORS.chart.purple}
          strokeWidth={3}
        />
        
        {/* 이벤트 발생 지점 */}
        {sortedEvents.map((event, index) => {
          const eventMinute = timeToMinutes(event.time);
          const x = ((eventMinute - startTime) / timeRange) * width;
          
          // 이벤트 발생 지점에서 실제 거리 찾기 (가장 가까운 데이터 포인트)
          const nearestPoint = distanceData.reduce((nearest, point) => {
            const currentDiff = Math.abs(point.minute - eventMinute);
            const nearestDiff = Math.abs(nearest.minute - eventMinute);
            return currentDiff < nearestDiff ? point : nearest;
          }, distanceData[0]);
          
          return (
            <G key={`distance-event-${index}`}>
              <Circle 
                cx={x} cy={nearestPoint.y} 
                r={6} 
                fill={COLORS.chart.red} 
              />
              <Line 
                x1={x} y1={nearestPoint.y}
                x2={x} y2={chartHeight}
                stroke={COLORS.chart.red}
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <SvgText 
                x={x} y={chartHeight}
                fontSize={10}
                fill={COLORS.text.secondary}
                textAnchor="middle"
              >
                {event.formattedTime}
              </SvgText>
            </G>
          );
        })}
        
        {/* 범례 */}
        <SvgText x={8} y={15} fontSize={10} fill={COLORS.chart.red}>
          위험 구간
        </SvgText>
        <SvgText x={8} y={chartHeight - 5} fontSize={10} fill={COLORS.chart.green}>
          안전 구간
        </SvgText>
      </Svg>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.chart.purple }]} />
          <Text style={styles.legendText}>실제 유지 거리</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.chart.green }]} />
          <Text style={styles.legendText}>안전 거리</Text>
        </View>
      </View>
    </View>
  );
};

const AccidentPreventionReportScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(options[0]);
  const [loading, setLoading] = useState(false);

  // 포맷팅 함수
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // API 명세서에 맞는 사고 예방 데이터
  const accidentData = {
    score: 34.666666666666664,
    reaction: {
      score: 0.0,
      feedback: "급정거나 위험 상황에서의 반응 속도가 느립니다. 전방 주시를 철저히 하고 안전거리를 확보하세요.",
      graph: [
        {
          startTime: "2025-04-25T08:17:00Z",
          endTime: "2025-04-25T08:17:02Z"
        },
        {
          startTime: "2025-04-25T08:34:00Z",
          endTime: "2025-04-25T08:34:02Z"
        },
        {
          startTime: "2025-04-25T08:51:00Z",
          endTime: "2025-04-25T08:51:02Z"
        },
        {
          startTime: "2025-04-25T09:08:00Z",
          endTime: "2025-04-25T09:08:02Z"
        },
        {
          startTime: "2025-04-25T09:25:00Z",
          endTime: "2025-04-25T09:25:02Z"
        }
      ]
    },
    laneDeparture: {
      score: 40.0,
      feedback: "차선 이탈이 빈번히 발생했습니다. 피로하거나 주의가 산만한 상태에서의 운전을 피하세요.",
      graph: [
        "2025-04-25T08:05:04Z",
        "2025-04-25T08:46:50Z",
        "2025-04-25T09:15:17Z",
        "2025-04-25T09:32:33Z",
        "2025-04-25T09:43:26Z",
        "2025-04-25T09:45:57Z"
      ]
    },
    followingDistance: {
      score: 64.0,
      feedback: "안전거리 유지가 필요합니다. 최소 2초 이상의 거리를 확보하여 주행하세요.",
      graph: [
        {
          startTime: "2025-04-25T08:17:00Z",
          endTime: "2025-04-25T08:17:02Z"
        },
        {
          startTime: "2025-04-25T08:34:00Z",
          endTime: "2025-04-25T08:34:02Z"
        },
        {
          startTime: "2025-04-25T08:51:00Z",
          endTime: "2025-04-25T08:51:02Z"
        },
        {
          startTime: "2025-04-25T09:08:00Z",
          endTime: "2025-04-25T09:08:02Z"
        },
        {
          startTime: "2025-04-25T09:25:00Z",
          endTime: "2025-04-25T09:25:02Z"
        },
        {
          startTime: "2025-04-25T09:42:00Z",
          endTime: "2025-04-25T09:42:02Z"
        }
      ]
    }
  };

  // 반응속도 이벤트 데이터 준비
  const prepareReactionEvents = () => {
    return accidentData.reaction.graph.map((item, index) => {
      const formattedStart = formatTime(item.startTime);
      return {
        id: `reaction-${index}`,
        time: item.startTime,
        formattedTime: formattedStart,
        endTime: item.endTime,
        formattedEndTime: formatTime(item.endTime),
        duration: 2, // 2초 (API 명세서에 따르면 모두 2초)
      };
    });
  };

  // 차선이탈 이벤트 데이터 준비
  const prepareLaneDepartureEvents = () => {
    return accidentData.laneDeparture.graph.map((time, index) => {
      const formattedTime = formatTime(time);
      return {
        id: `lane-${index}`,
        time: time,
        formattedTime: formattedTime,
      };
    });
  };

  // 안전거리유지 이벤트 데이터 준비
  const prepareFollowingDistanceEvents = () => {
    return accidentData.followingDistance.graph.map((item, index) => {
      const formattedStart = formatTime(item.startTime);
      return {
        id: `follow-${index}`,
        time: item.startTime,
        formattedTime: formattedStart,
        endTime: item.endTime,
        formattedEndTime: formatTime(item.endTime),
        duration: 2, // 2초 (API 명세서에 따르면 모두 2초)
      };
    });
  };

  // 차트 데이터 준비
  const reactionEvents = prepareReactionEvents();
  const laneDepartureEvents = prepareLaneDepartureEvents();
  const followingDistanceEvents = prepareFollowingDistanceEvents();

  // 탭 컨텐츠 렌더링
  const renderContent = () => {
    switch (selected) {
      case '반응속도':
        return renderReactionContent();
      case '차선이탈':
        return renderLaneDepartureContent();
      case '안전거리유지':
        return renderFollowingDistanceContent();
      default:
        return renderReactionContent();
    }
  };

  // 반응속도 탭 렌더링
  const renderReactionContent = () => {
    const scoreColor =
      accidentData.reaction.score < 50 ? COLORS.chart.red : COLORS.chart.purple;
    const scoreText = accidentData.reaction.score.toFixed(1);
    const eventsCount = reactionEvents.length;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          감지된 느린 반응 이벤트: {eventsCount}회
        </Text>

        <View style={styles.chartContainer}>
          <ReactionSpeedChart events={reactionEvents} height={200} />

          <View style={styles.eventsListContainer}>
            <Text style={styles.eventsListTitle}>반응 지연 감지 시간</Text>
            <View style={styles.eventsList}>
              {reactionEvents.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={styles.eventIndex}>#{index + 1}</Text>
                  <Text style={styles.eventTime}>
                    {event.formattedTime} ~ {event.formattedEndTime}
                  </Text>
                  <Text style={styles.eventDuration}>
                    {event.duration}초
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 차선이탈 탭 렌더링
  const renderLaneDepartureContent = () => {
    const scoreColor =
      accidentData.laneDeparture.score < 50 ? COLORS.chart.red : COLORS.chart.purple;
    const scoreText = accidentData.laneDeparture.score.toFixed(1);
    const eventsCount = laneDepartureEvents.length;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          감지된 차선 이탈: {eventsCount}회
        </Text>

        <View style={styles.chartContainer}>
          <LaneDepartureChart events={laneDepartureEvents} height={200} />

          <View style={styles.eventsListContainer}>
            <Text style={styles.eventsListTitle}>차선 이탈 시간</Text>
            <View style={styles.eventsList}>
              {laneDepartureEvents.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={styles.eventIndex}>#{index + 1}</Text>
                  <Text style={styles.eventTime}>{event.formattedTime}</Text>
                  <Icon name="alert-triangle" size={16} color={COLORS.chart.red} />
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.infoBox}>
            <Icon name="info" size={20} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              차선 이탈은 피로 운전, 주의력 산만, 또는 부적절한 스티어링 조작으로 인해 발생할 수 있습니다.
              정기적인 휴식과 집중력 유지가 중요합니다.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // 안전거리유지 탭 렌더링
  const renderFollowingDistanceContent = () => {
    const scoreColor =
      accidentData.followingDistance.score < 50 ? COLORS.chart.red : COLORS.chart.purple;
    const scoreText = accidentData.followingDistance.score.toFixed(1);
    const eventsCount = followingDistanceEvents.length;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          안전거리 미준수: {eventsCount}회
        </Text>

        <View style={styles.chartContainer}>
          <SafeDistanceChart events={followingDistanceEvents} height={200} />

          <View style={styles.eventsListContainer}>
            <Text style={styles.eventsListTitle}>안전거리 위반 감지 시간</Text>
            <View style={styles.eventsList}>
              {followingDistanceEvents.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={styles.eventIndex}>#{index + 1}</Text>
                  <Text style={styles.eventTime}>
                    {event.formattedTime} ~ {event.formattedEndTime}
                  </Text>
                  <Text style={styles.eventDuration}>
                    {event.duration}초
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <HeaderDropdown 
          currentScreen="accident" 
          primaryColor={COLORS.primary} 
          textColor={COLORS.text.primary}
        />
        <View style={styles.placeholderRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 카드 */}
        <View style={styles.reportHeader}>
          <View style={styles.gaugeContainer}>
            <GaugeChart
              percentage={accidentData.score}
              color={accidentData.score < 50 ? COLORS.chart.red : COLORS.primary}
              size={chartConfig.gaugeSize}
            />
          </View>
        </View>

        {/* 탭 메뉴 */}
        <View style={styles.tabContainer}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => setSelected(opt)}
              style={
                selected === opt
                  ? [styles.tabItem, styles.tabItemActive]
                  : styles.tabItem
              }
              activeOpacity={0.7}>
              <Text
                style={
                  selected === opt ? styles.tabTextActive : styles.tabText
                }>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 선택된 탭 컨텐츠 */}
        <View style={styles.contentContainer}>{renderContent()}</View>

        {/* 로봇 피드백 */}
        <View style={styles.feedbackContainer}>
          <View style={styles.robotContainer}>
            <Image
              source={require('../../assets/modive_robot1.png')}
              style={styles.robotImage}
              accessibilityLabel="모디브 로봇 아이콘"
            />
          </View>
          <View style={styles.feedbackTextContainer}>
            <Text style={styles.feedbackTitle}>운전 피드백</Text>
            <Text style={styles.feedbackText}>
              {selected === '반응속도'
                ? accidentData.reaction.feedback
                : selected === '차선이탈'
                ? accidentData.laneDeparture.feedback
                : accidentData.followingDistance.feedback}
            </Text>
          </View>
        </View>

        {/* 로딩 상태 */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>
              데이터를 불러오는 중입니다...
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 12,
    marginLeft: -8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  headerDropdown: {
    marginLeft: 5,
  },
  placeholderRight: {
    width: 24,
  },
  reportHeader: {
    marginHorizontal: 0,
    marginVertical: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(187, 39, 255, 0.3)',
    borderRadius: 16,
    backgroundColor: '#F5E9FF', // 보라색 계열 배경
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 0,
    marginTop: 8,
  },
  tabItem: {
    paddingVertical: 16,
    minHeight: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  contentContainer: {
    padding: 16,
    marginTop: 16,
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#EBDBF5', // 보라색 계열 테두리
  },
  contentBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  contentScore: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 16,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  contentDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.secondary,
    marginTop: 10,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    paddingHorizontal: 16,
  },
  gaugeContainer: {
    marginVertical: 0,
    marginBottom: 8,
    alignItems: 'center',
  },
  chartContainer: {
    marginTop: 24,
    marginBottom: 8,
    width: '100%',
    padding: 24,
    backgroundColor: COLORS.chart.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    color: COLORS.text.primary,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  chartInnerContainer: {
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    minHeight: 250,
    overflow: 'visible',
  },
  chartContent: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 24,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  dataPoint: {
    color: COLORS.text.light,
    fontSize: 12,
    marginBottom: 4,
  },
  chartAxisText: {
    color: COLORS.text.secondary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  timelineContainer: {
    width: '100%',
    marginVertical: 16,
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  eventsListContainer: {
    marginTop: 24,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(187, 39, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(187, 39, 255, 0.2)',
  },
  eventsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  eventsList: {
    width: '100%',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(203, 213, 224, 0.3)',
  },
  eventIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    width: 30,
  },
  eventTime: {
    fontSize: 14,
    color: COLORS.text.primary,
    flex: 1,
  },
  eventDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.chart.red,
    marginLeft: 8,
  },
  eventDataPoint: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  eventValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginTop: 24,
    backgroundColor: 'rgba(187, 39, 255, 0.08)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text.secondary,
  },
  safetyDistanceContainer: {
    marginTop: 24,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(187, 39, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(187, 39, 255, 0.2)',
  },
  safetyDistanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  safetyDistanceGuide: {
    width: '100%',
  },
  safetyDistanceText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  safetyDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  safetyDistanceSpeed: {
    width: '20%',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  safetyDistanceMeter: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  safetyDistanceMeterFill: {
    height: '100%',
    borderRadius: 4,
  },
  safetyDistanceValue: {
    width: '15%',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'right',
  },
  gaugeChartContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    marginBottom: 0,
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    backgroundColor: 'rgba(187, 39, 255, 0.15)',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  robotContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  chartSpecialContainer: {
    width: '100%',
    marginVertical: 16,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 224, 0.5)',
    overflow: 'hidden',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
});

export default AccidentPreventionReportScreen;
