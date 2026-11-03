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

export const SECONDARY_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Biology',
  'Chemistry',
  'Physics',
  'Geography',
  'History',
  'Commerce / Entrepreneurship',
  'Agriculture',
  'Literature in English',
  'Computer Studies / ICT',
  'CRE / IRE',
] as const;

export const ALL_SUBJECTS = [...new Set([
  ...LOWER_PRIMARY_SUBJECTS,
  ...UPPER_PRIMARY_SUBJECTS,
  ...SECONDARY_SUBJECTS,
])];

export const PRIMARY_CLASSES: readonly ClassName[] = ['P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7'] as const;
export const SECONDARY_CLASSES: readonly ClassName[] = ['S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'] as const;
export const ALL_CLASSES: readonly ClassName[] = [...PRIMARY_CLASSES, ...SECONDARY_CLASSES];

export const isLowerPrimary = (className: ClassName) =>
  className === 'P.1' || className === 'P.2' || className === 'P.3';

export const isSecondary = (className: ClassName) =>
  typeof className === 'string' && className.startsWith('S.');

export const getSubjectsForClass = (className: ClassName): readonly string[] => {
  if (isSecondary(className)) return SECONDARY_SUBJECTS;
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
