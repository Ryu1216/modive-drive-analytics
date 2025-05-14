import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {BarChart} from 'react-native-gifted-charts'; // 상단에 추가

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;

export default function ReportScreen() {
  const [weeklyReport, setweeklyReport] = useState({
    analysis: {
      title: '주행 분석 결과',
      summary:
        '홍길동님의 지난 1주일 주행 데이터를 분석한 결과, 급가속/급감속 비율이 15%로 나타났습니다. 이는 평균보다 5% 높은 수치로, 이 부분을 개선하면 연비 향상에 큰 도움이 될 것입니다. 또한, 정속 주행 비율이 40%로 목표치(60%)보다 낮습니다.',
      data: [
        {
          label: '급가속/급감속',
          value: 15,
          color: '#F47F6B',
        },
        {
          label: '정속 주행',
          value: 40,
          color: '#F6A43C',
        },
        {
          label: '공회전',
          value: 8,
          color: '#68C179',
        },
      ],
    },
    recommendations: {
      summary:
        '부드럽게 가속하고 미리 감속하는 습관을 들이면 연비가 최대 7% 개선될 수 있습니다. 특히 출발 시 첫 5초 동안 천천히 가속하는 것이 중요합니다.',
      tips: [
        {
          text: '크루즈 컨트롤을 활용하여 정속 주행 비율을 높이세요. **월 주유비 약 8,000원 절감 효과**가 있습니다.',
        },
        {
          text: '신호등에 접근할 때 미리 엑셀에서 발을 떼고 감속하면 연료 소비를 줄일 수 있습니다. **도심 주행 시 연비 5% 향상** 효과가 있습니다.',
        },
        {
          text: '타이어 공기압을 적정 수준으로 유지하세요. 현재 주행 패턴을 고려했을 때 **2~3%의 추가 연비 개선이 가능**합니다.',
        },
      ],
    },
  });

  // 차트 가로 너비 계산 (패딩을 고려한 값)
  const chartWidth = screenWidth - 120; // 패딩과 여백을 고려한 값 (30px 양쪽 패딩 + 추가 여백)
  // 데이터 항목 수
  const dataCount = weeklyReport.analysis.data.length;
  // 반응형으로 바 너비와 간격 계산
  // 전체 너비의 60%를 바가 차지하고, 40%를 간격이 차지하도록 설정
  const totalBarWidthPercentage = 0.5; // 전체 너비 중 바가 차지하는 비율
  const totalWidth = chartWidth - 40; // 여백 고려
  // 데이터 항목 수에 따라 바 너비와 간격 동적 계산
  const barWidth = Math.floor(
    (totalWidth * totalBarWidthPercentage) / dataCount,
  );
  const spacing = Math.floor(
    (totalWidth * (1 - totalBarWidthPercentage)) / (dataCount + 1),
  );

  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.reportBox}>
        <Text style={styles.titleText}>연비 향상 맞춤 피드백</Text>
        <View style={styles.analysisBox}>
          <Text style={styles.analysisTitleText}>
            <MaterialCommunityIcons
              name="google-analytics"
              size={24}
              color="#3F5AF0"
            />
            {'  '}
            주행 분석 결과
          </Text>

          <Text style={styles.summaryText}>
            {weeklyReport.analysis.summary}
          </Text>

          <View style={{alignItems: 'center'}}>
            <Text style={styles.subTitle}>연비 영향 요소 분석</Text>
          </View>
          {weeklyReport.analysis.data.map((item, index) => (
            <View key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}>
                <Text style={{fontSize: 13, color: '#555'}}>{item.label}</Text>
                <Text style={{fontSize: 13, color: '#555'}}>{item.value}%</Text>
              </View>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreProgress,
                    {
                      backgroundColor: item.color,
                      width: `${item.value}%`,
                      borderRadius: 15,
                    },
                  ]}
                />
              </View>
            </View>
          ))}

          {/* BarChart */}
          {/* <View>
              <BarChart
                data={weeklyReport.analysis.data.map(item => ({
                  value: item.value,
                  label: item.label,
                  frontColor: item.color,
                  topLabelComponent: () => (
                    <Text
                      style={{
                        color: item.color,
                        fontSize: 12,
                        fontWeight: 'bold',
                        marginBottom: 6,
                      }}>
                      {item.value}%
                    </Text>
                  ),
                }))}
                barWidth={barWidth}
                spacing={spacing}
                noOfSections={1}
                xAxisLabelTextStyle={{fontSize: 12, color: '#555'}}
                yAxisThickness={1}
                xAxisThickness={1}
                yAxisColor={'#DDD'}
                xAxisColor={'#DDD'}
                yAxisTextStyle={{color: '#888', fontSize: 12}}
                maxValue={100}
                stepValue={20}
                barBorderRadius={4}
                isAnimated
              />
            </View> */}
        </View>
        <View style={styles.tipBox}>
          {/* 제목 */}
          <View style={styles.tipTitleRow}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={24}
              color="#3F5AF0"
            />
            <Text style={styles.tipTitleText}>연비 향상을 위한 맞춤 조언</Text>
          </View>

          {/* 요약 문단 */}
          <Text style={styles.summaryText}>
            {weeklyReport.recommendations.summary}
          </Text>

          {/* 팁 리스트 */}
          {weeklyReport.recommendations.tips.map((tip, index) => (
            <View style={styles.tipListItem} key={index}>
              <View style={styles.tipCircle}>
                <Text style={styles.tipCircleText}>{index + 1}</Text>
              </View>
              <Text style={styles.tipListText}>
                {/* 강조 처리 */}
                {tip.text.split('**').map((text, idx) =>
                  idx % 2 === 1 ? (
                    <Text key={idx} style={styles.tipHighlight}>
                      {text}
                    </Text>
                  ) : (
                    <Text key={idx}>{text}</Text>
                  ),
                )}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  reportBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    gap: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  analysisBox: {
    backgroundColor: '#F1F5FD',
    gap: 10,
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
  tipBox: {
    backgroundColor: '#F1F5FD',
    gap: 12,
    padding: 15,
    borderRadius: 12,
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },

  summaryText: {
    fontSize: 13,
    lineHeight: 20,
  },

  tipHighlight: {
    color: '#000',
    fontWeight: 'bold',
  },

  tipListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  tipCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D3D9F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tipCircleText: {
    color: '#3F5AF0',
    fontWeight: 'bold',
    fontSize: 12,
  },

  tipListText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    flex: 1,
  },
});
