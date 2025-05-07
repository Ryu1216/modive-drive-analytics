import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from 'styled-components/native';

type DashboardStackParamList = {
  Dashboard: undefined;
  Feedback: undefined;
};

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<DashboardStackParamList>>();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>홈 화면</Text>
      <Button
        title="Go to Feedback"
        onPress={() => navigation.navigate('Feedback')}
      />
    </View>
  );
}

// const Container = styled``;
