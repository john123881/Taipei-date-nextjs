import React, { useState, useEffect } from 'react';
import NoContentNoon from './no-content-noon';
import BarPhotoMy from './bar-photo-my';
import MoviePhotoMy from './movie-photo-my';

export default function ContentNoon({ trip_plan_id, newDetail }) {
  const [tripDetails, setTripDetails] = useState({});

  useEffect(() => {
    if (trip_plan_id) {
      const fetchTripDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/trip/my-details/noon-content/${trip_plan_id}`
          );
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Fetched TripDetail Data:', data);

          if (data && data.length > 0) {
            setTripDetails(data[0]);
            console.log('Setting tripDetail to:', data[0]);
          } else {
            // 設置一個明確的“沒有內容”的狀態
            setTripDetails({ block: null });
          }
        } catch (error) {
          console.error('Fetching trip details error:', error);
          // 在錯誤情況下也設置一個明確狀態
          setTripDetails({ block: null });
        }
      };

      fetchTripDetails();
    }
  }, [newDetail, trip_plan_id]);

  //傳遞給子元件的函數 用於重新渲染頁面
  const refreshTripDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/trip/my-details/noon-content/${trip_plan_id}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched TripDetail Data:', data);
      if (data && data.length > 0) {
        setTripDetails(data[0]);
        console.log('Setting tripDetail to:', data[0]);
      } else {
        setTripDetails({ block: null });
      }
    } catch (error) {
      console.error('Fetching trip details error:', error);
      setTripDetails({ block: null });
    }
  };

  // 根據 block 值來決定顯示哪個組件
  return (
    <>
      {tripDetails.block !== 2 ? (
        <NoContentNoon refreshTripDetails={refreshTripDetails} />
      ) : tripDetails.movie_id ? (
        <MoviePhotoMy
          trip_plan_id={trip_plan_id}
          tripDetails={tripDetails}
          refreshTripDetails={refreshTripDetails}
        />
      ) : tripDetails.bar_id ? (
        <BarPhotoMy
          trip_plan_id={trip_plan_id}
          tripDetails={tripDetails}
          refreshTripDetails={refreshTripDetails}
        />
      ) : (
        <NoContentNoon />
      )}
    </>
  );
}
