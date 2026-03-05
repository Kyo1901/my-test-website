import { useEffect, useRef, useState } from 'react';

/** requestAnimationFrame 기반 쓰로틀 — 스크롤 핸들러 60fps 최적화 */
function rafThrottle(fn) {
  let rafId = null;
  return function (...args) {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      fn.apply(this, args);
      rafId = null;
    });
  };
}

/**
 * Intersection Observer 기반 가시성 감지 훅
 *
 * @param {object} options
 * @param {number} options.threshold  - 가시성 임계값 0~1 [기본값: 0.12]
 * @param {string} options.rootMargin - 루트 여백    [기본값: '0px 0px -60px 0px']
 * @param {boolean} options.once     - 한 번만 트리거 [기본값: true]
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
export function useIntersectionObserver({
  threshold = 0.12,
  rootMargin = '0px 0px -60px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}

/**
 * 페이지 전체 스크롤 진행률 훅
 * prefers-reduced-motion 활성 시 0 고정
 *
 * @returns {number} 0~1 사이 스크롤 진행률
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handler = rafThrottle(() => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? Math.min(scrollTop / docH, 1) : 0);
    });

    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return progress;
}

/**
 * 패럴렉스 수직 오프셋 훅
 * CSS transform3d 적용용 픽셀 값 반환
 * prefers-reduced-motion 활성 시 0 고정
 *
 * @param {number} speed - 스크롤 대비 이동 비율 [기본값: 0.15]
 * @returns {number} Y축 오프셋(px)
 */
export function useParallaxOffset(speed = 0.15) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handler = rafThrottle(() => {
      setOffset(window.scrollY * speed);
    });

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [speed]);

  return offset;
}
