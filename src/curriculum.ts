import type { ClassName } from './types';

export const LOWER_PRIMARY_SUBJECTS = [
  'Mathematics',
  'English',
  'Literacy 1',
  'Literacy 2 (Reading and Writing)',
  'Religious Education',
  'Luganda',
  'Computer/ ICT',
  'KUMON',
] as const;

export const UPPER_PRIMARY_SUBJECTS = [
  'English',
  'Mathematics',
  'Social Studies',
  'Science',
  'Religious Education',
  'Computer/ ICT',
] as const;

export const LOCAL_LANGUAGES = ['Ateso','Dhopadhola','Leb Acoli','Leblango','Luganda','Lugbarati','Lumasaaba','Lusoga','Runyankore-Rukiga','Runyoro-Rutooro'] as const;
export const O_LEVEL_CORE = ['English Language','Mathematics','History and Political Education','Geography','Physics','Biology','Chemistry'] as const;
export const O_LEVEL_SUBJECTS = [...O_LEVEL_CORE,'Physical Education','Christian Religious Education (CRE)','Islamic Religious Education (IRE)','Entrepreneurship','Kiswahili','Agriculture','Information and Communication Technology (ICT)','Literature in English','Art and Design','Performing Arts','Technology and Design','Nutrition and Food Technology','General Science','Arabic','Chinese','French','German','Latin',...LOCAL_LANGUAGES] as const;
export const A_LEVEL_SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','Economics','History','Geography','Literature in English','Christian Religious Education (CRE)','Islamic Religious Education (IRE)','Entrepreneurship Education','Agriculture','Art and Design','Clothing and Textiles','Foods and Nutrition','Music','Physical Education','Principal ICT','Technical Drawing','Metalwork','Woodwork','Arabic','Chinese','French','German','Kiswahili','Latin',...LOCAL_LANGUAGES,'General Paper','Subsidiary Mathematics','Subsidiary ICT'] as const;

export const SECONDARY_SUBJECTS = [...new Set([...O_LEVEL_SUBJECTS,...A_LEVEL_SUBJECTS])];
const LEGACY_SECONDARY_SUBJECTS = ['History','English Language','Commerce / Entrepreneurship','Computer Studies / ICT','CRE / IRE'];

export const ALL_SUBJECTS = [...new Set([
  ...LOWER_PRIMARY_SUBJECTS,
  ...UPPER_PRIMARY_SUBJECTS,
  ...SECONDARY_SUBJECTS,
  ...LEGACY_SECONDARY_SUBJECTS,
])];

export const PRIMARY_CLASSES: readonly ClassName[] = ['P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7'] as const;
export const SECONDARY_CLASSES: readonly ClassName[] = ['S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'] as const;
export const ALL_CLASSES: readonly ClassName[] = [...PRIMARY_CLASSES, ...SECONDARY_CLASSES];

export const isLowerPrimary = (className: ClassName) =>
  className === 'P.1' || className === 'P.2' || className === 'P.3';

export const isSecondary = (className: ClassName) =>
  typeof className === 'string' && className.startsWith('S.');

export const getSubjectsForClass = (className: ClassName): readonly string[] => {
  if (className === 'S.5' || className === 'S.6') return [...new Set([...A_LEVEL_SUBJECTS,...LEGACY_SECONDARY_SUBJECTS])];
  if (isSecondary(className)) return [...new Set([...O_LEVEL_SUBJECTS,...LEGACY_SECONDARY_SUBJECTS])];
  if (isLowerPrimary(className)) return LOWER_PRIMARY_SUBJECTS;
  if (className === 'P.4' || className === 'P.5') {
    return [...UPPER_PRIMARY_SUBJECTS, 'KUMON'];
  }
  return UPPER_PRIMARY_SUBJECTS;
};

export const isSubjectForClass = (className: ClassName, subject: string) => {
  if (!subject) return false;
  return true;
};

export const getStudentClassForYear = (
  student: { className: ClassName; classHistory?: Record<number, ClassName>; yearOfEntry?: number },
  targetYear: number,
  activeYear: number = new Date().getFullYear()
): ClassName => {
  if (student.classHistory && student.classHistory[targetYear]) {
    return student.classHistory[targetYear];
  }
  if (targetYear >= activeYear) {
    return student.className;
  }
  const currentIdx = ALL_CLASSES.indexOf(student.className);
  if (currentIdx !== -1) {
    const diff = activeYear - targetYear;
    const pastIdx = Math.max(0, currentIdx - diff);
    return ALL_CLASSES[pastIdx];
  }
  return student.className;
};

// Import secondary class labels without silently converting them to primary.
export const parseClassName = (value: unknown): ClassName | null => {
  let key=String(value ?? '').trim().toUpperCase().replace(/[\s._-]/g,'').replace(/^PRIMARY/,'P').replace(/^(SENIOR|SECONDARY)/,'S');
  const words=['ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN'];
  for(let i=0;i<words.length;i++)if(key==='P'+words[i]||key==='S'+words[i])key=key[0]+(i+1);
  if(!/^[PS][1-7]$/.test(key))return null;
  const result=(key[0]+'.'+key[1]) as ClassName;
  return ALL_CLASSES.includes(result)?result:null;
};
export const getNextClassName = (current: ClassName): string => {
  if(current==='P.7'||current==='S.6')return 'Graduated';
  const index=ALL_CLASSES.indexOf(current);
  return index<0?'Graduated':ALL_CLASSES[index+1];
};
