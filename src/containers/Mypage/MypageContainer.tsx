import {useState} from 'react';
import MypageScreen from '../../screens/Mypage/MypageScreen.tsx';

// @ts-ignore
export const MypageContainer = ({navigation}) => {
  const [nickname, setNickname] = useState('모디브');
  const [car, setCar] = useState('123가4567');

  return <MypageScreen
    nickname={nickname}
    car={car}
    navigation={navigation}
  />;
};

