import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrivingAnalysis} from '../../../types/report';
import AnalysisChart from './AnalysisChart';

export default function AnalysisBox({analysis}: {analysis: DrivingAnalysis}) {
  return (
    <View style={styles.analysisBox}>
      <Text style={styles.analysisTitleText}>
        <MaterialCommunityIcons
          name="google-analytics"
          size={24}
          color="#3F5AF0"
        />
        {'  '}
        {analysis.title}
      </Text>

      <Text style={styles.summaryText}>{analysis.summary}</Text>

      <AnalysisChart chartData={analysis.data} />
    </View>
  );
}

const styles = StyleSheet.create({
  analysisBox: {
    backgroundColor: '#F1F5FD',
    gap: 12,
    padding: 15,
    borderRadius: 12,
  },
  analysisTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  scoreBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'visible',
    marginTop: 8,
    position: 'relative',
    backgroundColor: '#c4c4c4',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
