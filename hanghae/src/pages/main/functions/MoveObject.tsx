import React, { useRef, useEffect, useState, type FC } from "react";
import "./MoveObject.scss"; // SCSS 파일 임포트

// myFn 객체를 TypeScript에 맞게 타입 정의 (이전과 동일)
interface MyFn {
  qs: (selector: string) => HTMLElement | null;
  qsEl: (el: HTMLElement, selector: string) => HTMLElement | null;
  qsa: (selector: string) => NodeListOf<HTMLElement>;
  qsaEl: (el: HTMLElement, x: string) => NodeListOf<HTMLElement>;
  addEvt: (
    ele: HTMLElement | Window,
    evt: string,
    fn: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => void;
  removeEvt: (
    ele: HTMLElement | Window,
    evt: string,
    fn: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) => void;
  getBCR: (ele: HTMLElement) => number;
  getOT: (ele: HTMLElement) => number;
}

const myFnInstance: MyFn = {
  qs: (x) => document.querySelector(x),
  qsEl: (el, x) => el.querySelector(x),
  qsa: (x) => document.querySelectorAll(x),
  qsaEl: (el, x) => el.querySelectorAll(x),
  addEvt: (ele, evt, fn, options) => ele.addEventListener(evt, fn, options),
  removeEvt: (ele, evt, fn, options) =>
    ele.removeEventListener(evt, fn, options),
  getBCR: (ele) => ele.getBoundingClientRect().top,
  getOT: (ele) => ele.offsetTop,
};

// MoveObject 컴포넌트의 props 인터페이스 정의 (이전과 동일)
interface MoveObjectProps {
  children: React.ReactNode;
  sectionHeight?: number;
  diagonalFactor?: number; // X, Y축에 공통으로 적용할 속도 계수
}

const MoveObject: FC<MoveObjectProps> = ({
  children,
  sectionHeight = window.innerHeight,
  diagonalFactor = 0.8, // 기본값 0.5로 설정
}) => {
  const moveObjectRef = useRef<HTMLDivElement>(null);
  const myFnRef = useRef<MyFn>(myFnInstance); // myFn 객체 참조

  const [currentY, setCurrentY] = useState<number>(1886);
  const [currentX, setCurrentX] = useState<number>(226);
  const [sectionIndex, setSectionIndex] = useState<number>(0);

  // ⭐ 목표 Y, X 위치를 관리할 ref (리렌더링 유발 안 함)
  const targetY = useRef<number>(0);
  const targetX = useRef<number>(0);

  const SECTION_THRESHOLD = 0.8; // 화면 높이의 80% 지점에서 섹션 전환

  useEffect(() => {
    const moveObjectElement = moveObjectRef.current;
    if (!moveObjectElement) return;

    let animationFrameId: number | null = null; // animationFrameId 초기화 및 타입 지정

    // ⭐ 부드러운 애니메이션을 위한 Lerp(선형 보간) 함수
    const animate = () => {
      const lerpFactor = 0.05; // 값이 작을수록 더 부드럽고 느리게 이동

      const smoothedY = currentY + (targetY.current - currentY) * lerpFactor;
      const smoothedX = currentX + (targetX.current - currentX) * lerpFactor;

      // 목표 값에 충분히 가까워지면 정확히 목표 값으로 설정하고 애니메이션 중단
      if (
        Math.abs(targetY.current - smoothedY) < 0.1 &&
        Math.abs(targetX.current - smoothedX) < 0.1
      ) {
        setCurrentY(targetY.current);
        setCurrentX(targetX.current);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = null;
      } else {
        setCurrentY(smoothedY);
        setCurrentX(smoothedX);
        animationFrameId = requestAnimationFrame(animate); // 다음 프레임 요청
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const deltaY = e.deltaY; // 휠을 아래로 내리면 양수, 위로 올리면 음수

      // 휠 입력에 따라 목표 위치를 업데이트
      // 휠을 내릴 때 (deltaY > 0): targetY 감소 (오브젝트 위로), targetX 감소 (오브젝트 왼쪽으로)
      targetY.current = targetY.current - deltaY * diagonalFactor;
      targetX.current = targetX.current - deltaY * diagonalFactor;

      // 애니메이션 루프가 아직 실행 중이 아니면 시작
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(animate);
      }

      // 섹션 전환 로직 (moveObjectElement의 실제 top 위치 기반)
      const objectTop = myFnRef.current.getBCR(moveObjectElement);
      const currentSectionEndThreshold = window.innerHeight * SECTION_THRESHOLD;
      const previousSectionStartThreshold = window.innerHeight * (1 - SECTION_THRESHOLD);


      // 휠을 아래로 내릴 때 (deltaY > 0)
      if (deltaY > 0) {
        // 오브젝트가 현재 섹션의 끝 임계값을 넘어갈 때 다음 섹션으로 전환 준비
        // 이 때 currentY가 아니라 objectTop을 기준으로 판단합니다.
        if (objectTop < currentSectionEndThreshold) {
            // 다음 섹션으로 인덱스만 증가시키고,
            // 목표 Y, X를 다음 섹션의 시작 위치 (0,0)으로 부드럽게 이동시킵니다.
            setSectionIndex((prev) => prev + 1);
            targetY.current = 0; // 다음 섹션의 시작 목표 위치
            targetX.current = 0;
            // 애니메이션 루프가 이미 시작되어 있다면, 부드럽게 목표 지점으로 이동할 겁니다.
        }
      }
      // 휠을 위로 올릴 때 (deltaY < 0)
      else if (deltaY < 0) {
        // 오브젝트가 이전 섹션의 시작 임계값을 넘어갈 때 이전 섹션으로 전환 준비
        if (objectTop > previousSectionStartThreshold && sectionIndex > 0) {
            setSectionIndex((prev) => prev - 1);
            // 목표 Y, X를 이전 섹션의 시작 위치 (0,0)으로 부드럽게 이동시킵니다.
            targetY.current = 0; // 이전 섹션의 시작 목표 위치
            targetX.current = 0;
            // 애니메이션 루프가 이미 시작되어 있다면, 부드럽게 목표 지점으로 이동할 겁니다.
        }
      }
    };

    // 휠 이벤트 리스너 등록 (passive: false 중요)
    myFnRef.current.addEvt(window, "wheel", handleWheel as EventListener, {
      passive: false,
    });

    return () => {
      myFnRef.current.removeEvt(window, "wheel", handleWheel as EventListener, {
        passive: false,
      });
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentY, currentX, sectionIndex, sectionHeight, diagonalFactor]); // 의존성 배열

  // 오브젝트에 적용되는 스타일 (여기서 최종 이동이 시각적으로 표현됨)
  const objectStyle: React.CSSProperties = {
    transform: `translate(${currentX}px, ${currentY}px)`, // X와 Y축 동시 적용
    transition: "none", // Lerp 로직이 부드러움을 제공하므로 CSS transition은 사용하지 않습니다.
  };

  return (
    // move-object-container가 전체 섹션을 담당하고 스크롤 이벤트를 감지
    <div className="move-object-container">
      {/* move-object는 transform으로 실제로 움직이는 자식 요소를 감쌉니다. */}
      <div className="move-object" style={objectStyle} ref={moveObjectRef}>
        {children}
      </div>
    </div>
  );
};

export default MoveObject;