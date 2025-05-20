import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const iconSetMap: {[key: string]: typeof Feather} = {
  Feather,
  MaterialCommunityIcons,
};

// @ts-ignore
export default function MypageScreen({navigation}) {
  const navInfo = [
    {
      nav: 'mypage_car',
      name: '내 차 정보',
      iconSet: 'MaterialCommunityIcons',
      iconName: 'car',
    },
    {
      nav: 'mypage_info',
      name: '내 정보',
      iconSet: 'Feather',
      iconName: 'user',
    },
    {
      nav: 'mypage_interest',
      name: '내 관심사',
      iconSet: 'Feather',
      iconName: 'heart',
    },
    {
      name: '로그아웃',
      iconSet: 'Feather',
      iconName: 'log-out',
      isLogout: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <EvilIcons
          name={'user'}
          size={70}
          color={'#c4c4c4'}
          style={styles.profileImage}
        />
        <View style={{gap: 3}}>
          <Text style={styles.profileName}>honghong</Text>
          <Text style={styles.profileCar}>04히 2025</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>계정</Text>
      {navInfo.map((item, index) => {
        const IconComponent = iconSetMap[item.iconSet];

        return (
          <TouchableOpacity
            key={index}
            style={styles.EditContainer}
            onPress={() => {
              if (item.nav) navigation.navigate(item.nav);
              else console.log('로그아웃'); // 로그아웃 처리
            }}>
            <View style={styles.EditHeader}>
              <View
                style={[
                  styles.iconCircle,
                  item.isLogout && styles.iconCircleLogout,
                ]}>
                <IconComponent
                  name={item.iconName}
                  size={20}
                  color={item.isLogout ? '#FF0000' : '#3F5AF0'}
                />
              </View>
              <Text
                style={[
                  item.isLogout ? styles.logout : styles.EditTitle,
                  item.isLogout && {marginLeft: 16},
                ]}>
                {item.name}
              </Text>
            </View>
            {!item.isLogout && (
              <Feather name="chevron-right" size={20} color="#c4c4c4" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },

  profile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#F1F5FD',
  },

  profileImage: {
    padding: 5,
  },

  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F5AF0',
  },

  profileCar: {
    fontSize: 12,
    color: '#B3B3B3',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#969696',
    marginBottom: 10,
    marginLeft: 5,
  },

  EditContainer: {
    width: '100%',
    padding: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  EditHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },

  EditIcon: {
    width: 40,
    height: 40,
  },

  EditTitle: {
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 10,
  },

  NextIcon: {
    width: 10,
    height: 10,
    marginRight: 30,
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 18,
    backgroundColor: '#F1F5FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconCircleLogout: {
    backgroundColor: '#FFE5E5',
  },

  logout: {
    fontSize: 16,
    color: '#FF0000',
    marginLeft: 10,
  },
});
