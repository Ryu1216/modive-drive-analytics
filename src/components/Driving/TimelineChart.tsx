import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, G, Circle, Text as SvgText } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { ACCIDENT_COLORS } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

interface TimelineEvent {
  time: string;
  formattedTime: string;
}

interface TimelineChartProps {
  events: TimelineEvent[];
  title: string;
  height?: number;
  showMarkers?: boolean;
}

// 타임라인 점 마커 컴포넌트
const TimelineMarker = ({
  x,
  y,
  color,
  time,
}: {
  x: number;
  y: number;
  color: string;
  time: string;
}) => (
  <G>
    <Circle cx={x} cy={y} r={6} fill={color} />
    <SvgText
      x={x}
      y={y - 10}
      fontSize={8}
      fill={ACCIDENT_COLORS.text.secondary}
      textAnchor="middle">
      {time}
    </SvgText>
  </G>
);

const TimelineChart: React.FC<TimelineChartProps> = ({
  events,
  title,
  height = 200,
  showMarkers = true,
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
  const startTime = timeToMinutes(sortedEvents[0]?.time) || 0;
  const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) || startTime + 60;
  
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
          stroke={ACCIDENT_COLORS.chart.grid} 
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
                stroke={ACCIDENT_COLORS.chart.grid} 
                strokeWidth={1} 
              />
              <SvgText 
                x={tickX} 
                y={height / 2 + 20} 
                fontSize={10} 
                fill={ACCIDENT_COLORS.text.secondary}
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
              color={ACCIDENT_COLORS.chart.purple}
              time={event.formattedTime}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    width: '100%',
    marginVertical: 16,
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCIDENT_COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default TimelineChart;

