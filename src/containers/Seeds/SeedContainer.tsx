import React, {useState} from 'react';
import SeedsScreen from '../../screens/Seeds/SeedsScreen';
import {SeedsResponse} from '../../types/seeds';

export default function SeedsContainer() {
  const [seeds, setSeeds] = useState({
    userId: '1',
    balance: 500,
    total: 14300,
  });

  const seedsHistory: SeedsResponse = {
    content: [
      {
        id: 1,
        userId: '1',
        amount: 1,
        type: 'EARNED',
        description: '출석점수',
        balanceSnapshot: 725,
        createdAt: '2025-05-20T12:43:45',
      },
      {
        id: 1,
        userId: '1',
        amount: 10,
        type: 'EARNED',
        description: '장기고객',
        balanceSnapshot: 715,
        createdAt: '2025-05-19T12:43:45',
      },
      {
        id: 1,
        userId: '1',
        amount: 10,
        type: 'EARNED',
        description: '이벤트미발생',
        balanceSnapshot: 705,
        createdAt: '2025-05-18T12:43:45',
      },
      {
        id: 1,
        userId: '1',
        amount: 5,
        type: 'EARNED',
        description: '종합점수',
        balanceSnapshot: 700,
        createdAt: '2025-05-17T12:43:45',
      },
    ],
    page: 1,
    pageSize: 10,
    totalPages: 4,
    totalElements: 40,
  };

  return <SeedsScreen seeds={seeds} seedsHistory={seedsHistory.content} />;
}
