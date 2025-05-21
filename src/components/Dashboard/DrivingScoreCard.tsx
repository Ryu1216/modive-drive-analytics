import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PieChart from 'react-native-pie-chart';

export type DrivingScoreCardProps = {
  title: string;
  color: string;
  textColor: string;
  score: number;
  data: {value: number; color: string; label: {text: string}}[];
};

export default function DrivingScoreCard({
  title,
  color,
  textColor,
  score,
  data,
}: DrivingScoreCardProps) {
  return (
    <View style={[styles.gridItem, {borderColor: color}]}>
      <Text style={[styles.cardTitle, {backgroundColor: color}]}>{title}</Text>
      <View style={styles.cardContent}>
        <View style={styles.scoreCard}>
          <PieChart
            widthAndHeight={100}
            series={data.map(d => ({value: d.value, color: d.color}))}
            cover={0.7}
          />
          <View style={styles.chartCenterText}>
            <Text style={[styles.centerScoreText, {color: textColor}]}>
              {score.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.legendBox}>
          {data.map((d, idx) => (
            <View key={idx} style={styles.legendRow}>
              <View style={[styles.legendDot, {backgroundColor: d.color}]} />
              <Text style={styles.legendLabel}>
                {d.label.text}: {d.value}점
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  scoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  legendBox: {
    marginTop: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#444',
  },
  chartCenterText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
