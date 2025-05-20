import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Logo from '../../assets/modive_logo.svg';

type Props = {
  leftType?: 'back' | 'logo' | 'none';
  rightType?: 'share' | 'edit' | 'close' | 'none';
  title?: string;
};

function CustomHeader({
  leftType = 'none',
  rightType = 'none',
  title = '',
}: Props) {
  const navigation = useNavigation();

  const renderLeft = () => {
    if (leftType === 'back') {
      return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} />
        </TouchableOpacity>
      );
    }

    if (leftType === 'logo') {
      return <Logo width={100} height={24} />;
    }
    return <View style={{width: 24}} />;
  };

  const renderRight = () => {
    if (rightType === 'share') {
      return (
        <TouchableOpacity onPress={() => console.log('공유')}>
          <Feather name="share" size={24} />
        </TouchableOpacity>
      );
    }

    if (rightType === 'edit') {
      return (
        <TouchableOpacity onPress={() => console.log('편집')}>
          <Text>편집</Text>
        </TouchableOpacity>
      );
    }
    return <View style={{width: 24}} />;
  };

  return (
    <View style={styles.container}>
      {renderLeft()}
      <Text style={styles.title}>{title}</Text>
      {renderRight()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(CustomHeader);
