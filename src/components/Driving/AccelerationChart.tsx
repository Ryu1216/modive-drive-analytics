import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { SAFETY_COLORS } from '../../theme/colors';

interface AccelerationChartProps {
  data: any[];
  title: string;
  height: number;
}

const AccelerationChart: React.FC<AccelerationChartProps> = ({ data, title, height }) => {
  // 바 차트 설정
  const barChartConfig = {
    barWidth: 30,
    spacing: 24,
    barBorderRadius: 10,
    yAxisThickness: 0,
    xAxisThickness: 1,
    xAxisColor: SAFETY_COLORS.chart.grid,
    height: height || 200,
    noOfSections: 4,
    maxValue: 100,
    showLine: true,
    isAnimated: true,
    animationDuration: 800,
    barStyle: {
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    lineConfig: {
      color: SAFETY_COLORS.chart.purple,
      thickness: 3,
      curved: true,
      hideDataPoints: false,
      dataPointsShape: 'circular',
      dataPointsWidth: 10,
      dataPointsHeight: 10,
      dataPointsColor: SAFETY_COLORS.chart.purple,
      startIndex: 0,
      endIndex: data.length - 1,
    },
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartInnerContainer}>
        <View style={styles.chartContent}>
          <BarChart data={data} {...barChartConfig} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 24,
    marginBottom: 8,
    width: '100%',
    padding: 24,
    backgroundColor: '#F9FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    color: '#2D3748',
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
});

export default AccelerationChart;