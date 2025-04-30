import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 임포트
import { View, Text } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>홈 화면</Text>
    </View>
  );
}

function DrivingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>주행기록 화면</Text>
    </View>
  );
}

function RewardScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>리워드 화면</Text>
    </View>
  );
}

function MyPageScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>마이페이지 화면</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';

            if (route.name === '홈') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === '주행기록') {
              iconName = focused ? 'car' : 'car-outline';
            } else if (route.name === '리워드') {
              iconName = focused ? 'gift' : 'gift-outline';
            } else if (route.name === '마이페이지') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4a90e2', // 선택된 탭 색
          tabBarInactiveTintColor: 'gray',   // 선택 안된 탭 색
        })}
      >
        <Tab.Screen name="홈" component={HomeScreen} />
        <Tab.Screen name="주행기록" component={DrivingScreen} />
        <Tab.Screen name="리워드" component={RewardScreen} />
        <Tab.Screen name="마이페이지" component={MyPageScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
