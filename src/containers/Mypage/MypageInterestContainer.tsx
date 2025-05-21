import MypageInterestScreen from '../../screens/Mypage/subpage/MypageInterestScreen.tsx';
import {useState} from 'react';

export const MypageInterestContainer = () => {

  const [value, setValue] = useState('');

  const setInterest = () => {

  }

  return <MypageInterestScreen
    value={value}
    setValue={setValue}
    setInterest={setInterest}/>
}
