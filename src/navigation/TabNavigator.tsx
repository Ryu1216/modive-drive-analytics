import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import FeedbackScreen from '../screens/Dashboard/FeedbackScreen';
import DrivingScreen from '../screens/Driving/DrivingScreen';
import DrivingHistoryScreen from '../screens/Driving/DrivingHistoryScreen';
import DrivingDetailScreen from '../screens/Driving/DrivingDetailScreen';
import SeedsScreen from '../screens/Seeds/SeedsScreen';
import MypageScreen from '../screens/Mypage/MypageScreen';
import ScreenLayout from '../components/CommonLayout';
import CustomHeader from '../components/CustomHeader';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          header: () => <CustomHeader leftType="logo" rightType="none" />,
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          header: () => (
            <CustomHeader
              leftType="back"
              rightType="share"
              title="주간 주행 리포트"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function DrivingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrivingHistory"
        component={DrivingHistoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Driving"
        component={DrivingScreen}
        options={{
          header: () => <CustomHeader leftType="back" rightType="none" title="주행 상세" />,
        }}
      />
      <Stack.Screen
        name="DrivingDetail"
        component={DrivingDetailScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}

function SeedsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Seeds"
        component={SeedsScreen}
        options={{
          header: () => <CustomHeader leftType="logo" rightType="none" />,
        }}
      />
    </Stack.Navigator>
  );
}

function MypageStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Mypage"
        component={MypageScreen}
        options={{
          header: () => <CustomHeader leftType="logo" rightType="none" />,
        }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          if (route.name === '홈')
            return <AntDesign name="home" size={size} color={color} />;
          if (route.name === '주행기록')
            return <Feather name="pie-chart" size={size} color={color} />;
          if (route.name === '리워드')
            return (
              <MaterialCommunity
                name="seed-outline"
                size={size}
                color={color}
              />
            );
          if (route.name === '마이페이지')
            return <Feather name="user" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4945FF',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="홈">
        {() => (
          <ScreenLayout>
            <DashboardStack />
          </ScreenLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="주행기록">
        {() => (
          <ScreenLayout>
            <DrivingStack />
          </ScreenLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="리워드">
        {() => (
          <ScreenLayout>
            <SeedsStack />
          </ScreenLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="마이페이지">
        {() => (
          <ScreenLayout>
            <MypageStack />
          </ScreenLayout>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
