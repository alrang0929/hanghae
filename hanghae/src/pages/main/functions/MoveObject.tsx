import React, { useRef, useEffect, useState, type FC } from 'react';
import './MoveObject.scss';

// myFn 객체를 TypeScript에 맞게 타입 정의
interface MyFn {
    qs: (selector: string) => HTMLElement | null;
    qsEl: (el: HTMLElement, selector: string) => HTMLElement | null;
    qsa: (selector: string) => NodeListOf<HTMLElement>;
    qsaEl: (el: HTMLElement, selector: string) => NodeListOf<HTMLElement>;
    addEvt: (ele: HTMLElement | Window, evt: string, fn: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
    removeEvt: (ele: HTMLElement | Window, evt: string, fn: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
    getBCR: (ele: HTMLElement) => number;
    getOT: (ele: HTMLElement) => number;
}

const myFn: MyFn = {
    qs: (x) => document.querySelector(x),
    qsEl: (el, x) => el.querySelector(x),
    qsa: (x) => document.querySelectorAll(x),
    qsaEl: (el, x) => el.querySelectorAll(x),
    addEvt: (ele, evt, fn, options) => ele.addEventListener(evt, fn, options),
    removeEvt: (ele, evt, fn, options) => ele.removeEventListener(evt, fn, options),
    getBCR: ele => ele.getBoundingClientRect().top,
    getOT: ele => ele.offsetTop,
};

// MoveObject 컴포넌트의 props 인터페이스 정의
interface MoveObjectProps {
    children: React.ReactNode;
    sectionHeight?: number;
    // 대각선 이동 속도를 제어하는 값 (양수일수록 가파른 대각선)
    diagonalFactor?: number; // X, Y축에 공통으로 적용할 속도 계수
}

// diagonalFactor 기본값을 0.5로 설정하여 적당한 대각선 느낌을 줍니다.
const MoveObject: FC<MoveObjectProps> = ({ children, sectionHeight = window.innerHeight, diagonalFactor = 3 }) => {
    const moveObjectRef = useRef<HTMLDivElement>(null);
    const [currentY, setCurrentY] = useState<number>(100);
    const [currentX, setCurrentX] = useState<number>(200);
    const [sectionIndex, setSectionIndex] = useState<number>(0);

    const SECTION_THRESHOLD = 3;

    useEffect(() => {
        const moveObjectElement = moveObjectRef.current;
        if (!moveObjectElement) return;

        let animationFrameId: number;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const deltaY = e.deltaY; // 휠을 아래로 내리면 양수, 위로 올리면 음수

            // Y축 이동 계산:
            // 스크롤 내릴 때 (deltaY > 0): 오브젝트가 좌측 상단으로 가려면 Y가 감소해야 함 (위로)
            // 스크롤 올릴 때 (deltaY < 0): 오브젝트가 우측 하단으로 가려면 Y가 증가해야 함 (아래로)
            const newY = currentY - deltaY * diagonalFactor; // deltaY와 반대 부호로 이동

            // X축 이동 계산:
            // 스크롤 내릴 때 (deltaY > 0): 오브젝트가 좌측 상단으로 가려면 X가 감소해야 함 (왼쪽으로)
            // 스크롤 올릴 때 (deltaY < 0): 오브젝트가 우측 하단으로 가려면 X가 증가해야 함 (오른쪽으로)
            const newX = currentX - deltaY * diagonalFactor; // deltaY와 반대 부호로 이동


            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                setCurrentY(newY);
                setCurrentX(newX);

                // 섹션 전환 로직 (수직 위치 기반)
                const objectTop = myFn.getBCR(moveObjectElement);
                const nextSectionStart = -sectionHeight * (sectionIndex + 1);
                const currentSectionStart = -sectionHeight * sectionIndex;

                if (deltaY > 0) { // 휠을 아래로 내릴 때 (우측 하단에서 좌측 상단으로 이동하며 다음 섹션으로 전환)
                    // 현재 오브젝트의 top 위치가 특정 임계값보다 작으면 다음 섹션으로 이동
                    if (objectTop < window.innerHeight * SECTION_THRESHOLD) {
                        setSectionIndex(prev => prev + 1);
                        setCurrentY(nextSectionStart); // 다음 섹션의 시작 Y 위치로 고정
                        setCurrentX(0); // 섹션 전환 시 X축 위치 초기화 (혹은 다른 고정 값)
                    }
                } else if (deltaY < 0) { // 휠을 위로 올릴 때 (좌측 상단에서 우측 하단으로 이동하며 이전 섹션으로 전환)
                    // 현재 오브젝트의 top 위치가 특정 임계값보다 크고, 첫 번째 섹션이 아니면 이전 섹션으로 이동
                    if (objectTop > window.innerHeight * (1 - SECTION_THRESHOLD) && sectionIndex > 0) {
                        setSectionIndex(prev => prev - 1);
                        setCurrentY(currentSectionStart); // 현재 섹션의 시작 Y 위치로 고정
                        setCurrentX(0); // 섹션 전환 시 X축 위치 초기화
                    }
                }
            });
        };

        myFn.addEvt(window, 'wheel', handleWheel as EventListener, { passive: false });

        return () => {
            myFn.removeEvt(window, 'wheel', handleWheel as EventListener, { passive: false });
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentY, currentX, sectionIndex, sectionHeight, diagonalFactor]); // 의존성 배열에 diagonalFactor 추가

    const objectStyle: React.CSSProperties = {
        transform: `translate(${currentX}px, ${currentY}px)`, // X와 Y축 동시 적용
        position: 'sticky',
        top: '0',
        transition: 'transform 0.1s ease-out', // 부드러운 애니메이션
    };

    return (
        <div className="move-object-container" style={objectStyle} ref={moveObjectRef}>
            {children}
        </div>
    );
};

export default MoveObject;