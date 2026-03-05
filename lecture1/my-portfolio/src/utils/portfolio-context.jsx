import { createContext, useContext, useState, useMemo, useCallback } from 'react';

export const CATEGORY_META = {
  Frontend: { color: '#0071E3', bg: 'rgba(0, 113, 227, 0.08)' },
  Backend: { color: '#34C759', bg: 'rgba(52, 199, 89, 0.08)' },
  '도구 & 기타': { color: '#9B59E0', bg: 'rgba(155, 89, 224, 0.08)' },
};

export const DEFAULT_META = { color: '#86868B', bg: 'rgba(134, 134, 139, 0.08)' };

export const getCategoryMeta = (category) => CATEGORY_META[category] || DEFAULT_META;

const initialAboutMeData = {
  basicInfo: {
    name: '김기호',
    education: '조선대학교',
    major: '컴퓨터공학과',
    experience: '신입',
    photo: `${import.meta.env.BASE_URL}profile.jpg`,
  },
  sections: [
    {
      id: 'dev-story',
      title: '나의 개발 스토리',
      content:
        '처음 코드 한 줄로 무언가를 만들어내는 경험을 했을 때, 개발의 매력에 빠졌습니다. 단순한 호기심이 깊은 흥미로 이어졌고, 그 흥미가 조선대학교 컴퓨터공학과 진학이라는 선택으로 이어졌습니다. 배울수록 더 알고 싶어지는 이 분야에서, 더 넓은 영역을 탐구하고 깊이 있는 공부를 이어가고 있습니다.',
      showInHome: true,
    },
    {
      id: 'philosophy',
      title: '개발 철학',
      content:
        '논리적인 사고를 바탕으로 문제를 분석하고, 끊임없는 공부를 통해 성장합니다. 단순히 동작하는 코드가 아닌, 읽기 쉽고 유지보수 가능한 코드를 지향합니다. 새로운 기술을 두려워하지 않고, 더 나은 방법을 항상 탐구하는 자세를 유지합니다.',
      showInHome: true,
    },
    {
      id: 'personal',
      title: '개인적인 이야기',
      content:
        '새로운 것에 대한 호기심이 많습니다. 기술 트렌드를 꾸준히 살펴보고, 다양한 분야에서 배움을 얻으려 노력합니다. 문제를 발견하면 해결책을 찾아내는 과정 자체를 즐기며, 이러한 성향이 개발자로서의 성장에 큰 원동력이 됩니다.',
      showInHome: false,
    },
  ],
  skills: [
    { id: 1, name: 'HTML', level: 90, category: 'Frontend', isMain: true, description: '시맨틱 마크업과 웹 표준을 준수하는 구조적 마크업 작성' },
    { id: 2, name: 'CSS', level: 80, category: 'Frontend', isMain: true, description: 'Flexbox, Grid를 활용한 반응형 레이아웃 구현' },
    { id: 3, name: 'JavaScript', level: 80, category: 'Frontend', isMain: true, description: 'ES6+ 문법과 DOM 조작, 비동기 처리 구현' },
    { id: 4, name: 'Java', level: 80, category: 'Backend', isMain: true, description: '객체지향 프로그래밍 및 자료구조/알고리즘 구현' },
    { id: 5, name: 'Python', level: 70, category: 'Backend', isMain: true, description: '데이터 처리 및 백엔드 로직 구현' },
    { id: 6, name: 'C', level: 65, category: 'Backend', isMain: false, description: '기초 시스템 프로그래밍 및 메모리 관리' },
    { id: 7, name: 'C++', level: 65, category: 'Backend', isMain: false, description: '객체지향과 절차지향을 결합한 시스템 프로그래밍' },
    { id: 8, name: 'SQL', level: 70, category: '도구 & 기타', isMain: false, description: '관계형 데이터베이스 설계 및 쿼리 작성' },
    { id: 9, name: 'Git', level: 75, category: '도구 & 기타', isMain: false, description: '버전 관리 및 협업을 위한 브랜치 전략 활용' },
  ],
};

const PortfolioContext = createContext(null);

/**
 * PortfolioProvider 컴포넌트
 *
 * Props:
 * @param {React.ReactNode} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <PortfolioProvider><App /></PortfolioProvider>
 */
export const PortfolioProvider = ({ children }) => {
  const [aboutMeData, setAboutMeData] = useState(initialAboutMeData);

  /** aboutMeData 변경 시에만 재계산 */
  const homeData = useMemo(() => {
    const content = aboutMeData.sections
      .filter((s) => s.showInHome)
      .map((s) => ({
        id: s.id,
        title: s.title,
        summary: s.content.length > 120
          ? `${s.content.substring(0, 120)}...`
          : s.content,
      }));

    const skills = [...aboutMeData.skills]
      .sort((a, b) => b.level - a.level)
      .slice(0, 4);

    return { content, skills, basicInfo: aboutMeData.basicInfo };
  }, [aboutMeData]);

  /** homeData 참조가 바뀔 때만 새 함수 생성 */
  const getHomeData = useCallback(() => homeData, [homeData]);

  /** Provider value 객체 안정화 — 불필요한 하위 리렌더링 방지 */
  const contextValue = useMemo(
    () => ({ aboutMeData, setAboutMeData, getHomeData }),
    [aboutMeData, getHomeData],
  );

  return (
    <PortfolioContext.Provider value={ contextValue }>
      { children }
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
