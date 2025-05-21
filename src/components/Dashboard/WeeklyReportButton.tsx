import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HomeStackParamList} from '../../types/dashboard';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
type WeeklyReportButtonProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList>;
};

export default function WeeklyReportButton({
  navigation,
}: WeeklyReportButtonProps) {
  return (
    <TouchableOpacity
      style={styles.weeklyButton}
      onPress={() => navigation.navigate('Feedback')}>
      <Text style={styles.weeklyButtonText}>주간 주행 리포트 보기</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // LLM 피드백
  weeklyButton: {
    backgroundColor: '#F5F5FF', // 연한 보라톤 배경
    padding: 20,
    borderRadius: 16,

    alignItems: 'center',
    marginTop: 20,
  },
  weeklyButtonText: {
    color: '#4945FF',
    fontSize: 16,
    fontWeight: '600',
  },
});
