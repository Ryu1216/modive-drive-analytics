import {useState} from 'react';
import MypageInfoScreen from '../../screens/Mypage/subpage/MypageInfoScreen.tsx';

export const MypageInfoContainer = () => {
  const [name, setName] = useState('모디브');
  const [nickname, setNickname] = useState('modive');
  const [email, setEmail] = useState('hong@email.com');

  const save = () => {

  }

  return (
    <MypageInfoScreen
      name={name}
      nickname={nickname}
      setNickname={setNickname}
      email={email}
      save={save}
    />
  );

}
