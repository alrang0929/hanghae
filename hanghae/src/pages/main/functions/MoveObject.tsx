// src/components/animation/MoveObject.tsx (혹은 pages/main/components/MoveObject.tsx)
import React, { useEffect, useRef, useCallback } from 'react';
import './moveObject.scss'; // 이 컴포넌트의 스타일

interface MoveObjectProps {
  children: React.ReactNode;
  initialTopPercent?: number;
  initialLeftPercent?: number;
  scrollFactorTop?: number;
  scrollFactorLeft?: number;
  className?: string;
}

export const MoveObject: React.FC<MoveObjectProps> = ({
  children,
  initialTopPercent = 110,
  initialLeftPercent = 85,
  scrollFactorTop = 0.01,
  scrollFactorLeft = 0.005,
  className = '',
}) => {
  const objectRef = document.querySelector('.scroll-animated-object'); // ⭐ useRef 훅 사용

  console.log(objectRef,'MoveObject 컴포넌트 렌더링');

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    const newTop = `${initialTopPercent - (currentScrollY * scrollFactorTop)}%`;
    const newLeft = `${initialLeftPercent - (currentScrollY * scrollFactorLeft)}%`;

    // if (objectRef) {
    //   requestAnimationFrame(() => {
    //     objectRef.style.top = newTop; // ⭐ ref를 통해 DOM 요소 접근
    //     objectRef.style.left = newLeft;
    //   });
    // }
    // console.log(newTop,"newTop");
    // console.log(newLeft,"newLeft");
  }, [initialTopPercent, initialLeftPercent, scrollFactorTop, scrollFactorLeft]);


  useEffect(() => { // ⭐ useEffect 훅 사용
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 컴포넌트 마운트 시 초기 위치 설정

    return () => { // ⭐ 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className={`scroll-animated-object ${className}`}> {/* ⭐ ref 연결 */}
      {children}
    </div>
  );
};