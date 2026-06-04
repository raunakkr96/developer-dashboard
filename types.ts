/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProgrammingLanguage = 'JavaScript' | 'TypeScript' | 'Python';

export interface Project {
  id: string;
  name: string;
  language: ProgrammingLanguage;
  linesOfCode: number;
  status: 'Active' | 'Completed' | 'On Hold';
  createdAt: string;
  description?: string;
  starred?: boolean;
}

export interface DailyCommitCount {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface LinesOfCodeHistory {
  day: string; // e.g. "Mon", "Tue"
  lines: number;
}
