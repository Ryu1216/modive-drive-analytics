import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { CARBON_COLORS } from '../../theme/colors';
import { IdlingEvent } from '../../types/report';

interface IdlingBarChartProps {
  events: IdlingEvent[];
  title: string;
  height?: number;
}

const IdlingBarChart: React.FC<IdlingBarChartProps> = ({ 
  events, 
  title,
  height = 200
}) => {
  // 바 차트 설정
  const idlingBarConfig = {
    horizontal: true,
    xAxisThickness: 1,
    xAxisColor: CARBON_COLORS.chart.grid,
    yAxisThickness: 0,
    yAxisTextStyle: styles.chartAxisText,
    hideYAxisText: false,
    noOfSections: 3,
    barWidth: 20,
    barBorderRadius: 4,
    frontColor: CARBON_COLORS.chart.blue,
    spacing: 20,
    hideRules: false,
    rulesColor: CARBON_COLORS.chart.lightGrid,
    rulesType: 'solid',
    showFractionalValues: true,
    roundToDigits: 1,
    showGradient: true,
    gradientColor: CARBON_COLORS.gradient.blueEnd,
    disablePress: true,
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={[styles.chartInnerContainer, {minHeight: events.length * 50 + 30}]}>
        <View style={styles.chartContent}>
          <BarChart 
            data={events.map(item => ({
              value: item.duration,
              label: item.label,
              barWidth: 20,
              labelComponent: () => (
                <Text style={styles.idlingLabel}>{item.label}</Text>
              ),
              frontColor: CARBON_COLORS.chart.blue,
              topLabelComponent: () => (
                <Text style={styles.idlingTimeLabel}>{item.duration.toFixed(1)}분</Text>
              ),
            }))}
            {...idlingBarConfig}
            maxValue={Math.max(...events.map(item => item.duration)) * 1.2}
            yAxisLabelWidth={60}
            height={events.length * 50}
          />
        </View>

        <View style={styles.idlingTimelineInfo}>
          {events.map((item, index) => (
            <View key={index} style={styles.idlingTimeItem}>
              <Text style={styles.idlingTimeItemLabel}>{item.label}:</Text>
              <Text style={styles.idlingTimeItemValue}>
                {item.startTime} ~ {item.endTime}
              </Text>
            </View>
          ))}
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
  chartAxisText: {
    color: '#4A5568',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  idlingLabel: {
    fontSize: 12,
    color: '#4A5568',
    marginLeft: -50,
    width: 50,
    textAlign: 'right',
  },
  idlingTimeLabel: {
    fontSize: 12,
    color: '#2D3748',
    fontWeight: '600',
    marginLeft: 5,
  },
  idlingTimelineInfo: {
    marginTop: 20,
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  idlingTimeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(203, 213, 224, 0.3)',
  },
  idlingTimeItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    width: '30%',
  },
  idlingTimeItemValue: {
    fontSize: 14,
    color: '#2D3748',
    width: '70%',
    textAlign: 'right',
  },
});

export default IdlingBarChart;