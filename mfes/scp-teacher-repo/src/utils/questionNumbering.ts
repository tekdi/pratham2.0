interface HierarchyQuestion {
  identifier: string;
  name: string;
  index: number;
  maxScore: number;
}

interface HierarchySection {
  identifier: string;
  name: string;
  index: number;
  children: HierarchyQuestion[];
}

interface HierarchyData {
  result: {
    questionset: {
      children: HierarchySection[];
    };
  };
}

export const getQuestionNumbering = (hierarchyData: HierarchyData, questionId: string): string => {
  if (!hierarchyData?.result?.questionset?.children) {
    return '';
  }

  const sections = hierarchyData.result.questionset.children;
  
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    const sectionNumber = sectionIndex + 1;
    
    if (section?.children) {
      for (const question of section?.children) {
        if (question.identifier === questionId) {
          return `Q${sectionNumber}.${question.index}`;
        }
      }
    }
  }
  
  return '';
};

export const createQuestionNumberingMap = (hierarchyData: HierarchyData): Record<string, string> => {
  const numberingMap: Record<string, string> = {};
  
  if (!hierarchyData?.result?.questionset?.children) {
    return numberingMap;
  }

  const sections = hierarchyData.result.questionset.children;
  
  sections.forEach((section, sectionIndex) => {
    const sectionNumber = sectionIndex + 1;
    
    if (section.children) {
      section.children.forEach((question) => {
        numberingMap[question.identifier] = `Q${sectionNumber}.${question.index}`;
      });
    }
  });
  
  return numberingMap;
}; 