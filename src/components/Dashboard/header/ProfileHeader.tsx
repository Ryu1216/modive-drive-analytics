import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {UseResponse} from '../../../types/user';

type ProfileHeaderProps = {
  userInfo: UseResponse;
  isEnabled: boolean;
  toggleSwitch: () => void;
};

export default function ProfileHeader({
  userInfo,
  isEnabled,
  toggleSwitch,
}: ProfileHeaderProps) {
  return (
    <View style={styles.profileHeader}>
      <Text style={styles.username}>
        <Text style={styles.highlight}>{userInfo.nickname}</Text>님의 운전
        프로필
      </Text>
      <View style={styles.toggleArea}>
        <Feather name="volume-2" size={22} color="#4945FF" />
        <Switch
          trackColor={{false: '#767577', true: '#4945FF'}}
          thumbColor="#fff"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  username: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  highlight: {
    fontSize: 20,
    color: '#4945FF',
    fontWeight: 'bold',
  },
  toggleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
