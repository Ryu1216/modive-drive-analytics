import MypageCarScreen from '../../screens/Mypage/subpage/MypageCarScreen.tsx';

export const MypageCarContainer = () => {

  const cars: Car[] = [
    {index: 0, number: '04히 2025', selected: true},
    {index: 1, number: '04히 1234', selected: false},
    {index: 2, number: '04히 5678', selected: false},
  ];

  const addCar = () => {

  }

  const setCar = () => {

  }

  const deleteCar = () => {

  }

  return (
    <MypageCarScreen
      cars={cars}
      addCar={addCar}
      setCar={setCar}
      deleteCar={deleteCar}
    />
  );
}
