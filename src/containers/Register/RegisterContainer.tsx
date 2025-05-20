import {useRef, useState} from 'react';
import PagerView from 'react-native-pager-view';
import {RegisterScreen} from '../../screens/Register/RegisterScreen.tsx';

export const RegisterContainer = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const [nickname, setNickname] = useState('');
  const [drive, setDrive] = useState('');
  const [carNum, setCarNum] = useState('');
  const [interest, setInterest] = useState('');

  const pagerRef = useRef<PagerView | null>(null);

  const goToPrior = () => {
    pagerRef.current?.setPage(pageIndex - 1);
    setPageIndex(pageIndex - 1);
  };

  const goToNext = () => {
    pagerRef.current?.setPage(pageIndex + 1);
    setPageIndex(pageIndex + 1);
  };

  const close = () => {

  };

  return (
    <RegisterScreen
    pageIndex={pageIndex}
    nickname={nickname}
    drive={drive}
    carNum={carNum}
    interest={interest}
    setNickname={setNickname}
    setDrive={setDrive}
    setCarNum={setCarNum}
    setInterest={setInterest}
    goToPrior={goToPrior}
    goToNext={goToNext}
    close={close}
    pagerRef={pagerRef}
    />
  );
}
