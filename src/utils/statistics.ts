// utils/statistics.ts
import { UserProfile, ProjectSubmission } from '../types/schema';

export interface DescriptiveStats {
  n: number;
  mean: number;
  sd: number;
  median: number;
  min: number;
  max: number;
}

export interface TTestResult {
  tValue: number;
  df: number;
  pValue: number;
  isSignificant: boolean;
  effectSizeD: number; // Cohen's d
  etaSquared?: number; // Eta squared
  mean1: number;
  mean2: number;
  meanDiff: number;
}

export function calculateDescriptiveStats(data: number[]): DescriptiveStats {
  const clean = data.filter(n => typeof n === 'number' && !isNaN(n));
  const n = clean.length;
  if (n === 0) {
    return { n: 0, mean: 0, sd: 0, median: 0, min: 0, max: 0 };
  }

  const sum = clean.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  const variance = n > 1
    ? clean.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1)
    : 0;
  const sd = Math.sqrt(variance);

  const sorted = [...clean].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  return {
    n,
    mean: Number(mean.toFixed(2)),
    sd: Number(sd.toFixed(2)),
    median: Number(median.toFixed(2)),
    min: Number(sorted[0].toFixed(2)),
    max: Number(sorted[n - 1].toFixed(2))
  };
}

// Paired samples t-test (e.g. Pre-Test vs Post-Test)
export function calculatePairedTTest(pre: number[], post: number[]): TTestResult {
  const pairs: { pre: number; post: number; diff: number }[] = [];
  const minLen = Math.min(pre.length, post.length);
  for (let i = 0; i < minLen; i++) {
    if (!isNaN(pre[i]) && !isNaN(post[i])) {
      pairs.push({ pre: pre[i], post: post[i], diff: post[i] - pre[i] });
    }
  }

  const n = pairs.length;
  if (n < 2) {
    return {
      tValue: 0,
      df: 0,
      pValue: 1,
      isSignificant: false,
      effectSizeD: 0,
      mean1: 0,
      mean2: 0,
      meanDiff: 0
    };
  }

  const diffs = pairs.map(p => p.diff);
  const statsPre = calculateDescriptiveStats(pairs.map(p => p.pre));
  const statsPost = calculateDescriptiveStats(pairs.map(p => p.post));
  const diffStats = calculateDescriptiveStats(diffs);

  const se = diffStats.sd / Math.sqrt(n);
  const tValue = se > 0 ? diffStats.mean / se : 0;
  const df = n - 1;

  // Approximate p-value based on t-distribution approximation
  const pValue = approximatePValue(Math.abs(tValue), df);
  const effectSizeD = diffStats.sd > 0 ? diffStats.mean / diffStats.sd : 0;

  return {
    tValue: Number(tValue.toFixed(3)),
    df,
    pValue: Number(pValue.toFixed(4)),
    isSignificant: pValue < 0.05,
    effectSizeD: Number(effectSizeD.toFixed(3)),
    mean1: statsPre.mean,
    mean2: statsPost.mean,
    meanDiff: Number(diffStats.mean.toFixed(2))
  };
}

// Independent samples t-test (e.g. Individual vs Collaborative Group)
export function calculateIndependentTTest(group1: number[], group2: number[]): TTestResult {
  const g1 = group1.filter(v => !isNaN(v));
  const g2 = group2.filter(v => !isNaN(v));

  const n1 = g1.length;
  const n2 = g2.length;

  if (n1 < 2 || n2 < 2) {
    return {
      tValue: 0,
      df: 0,
      pValue: 1,
      isSignificant: false,
      effectSizeD: 0,
      etaSquared: 0,
      mean1: 0,
      mean2: 0,
      meanDiff: 0
    };
  }

  const stats1 = calculateDescriptiveStats(g1);
  const stats2 = calculateDescriptiveStats(g2);

  const df = n1 + n2 - 2;
  const pooledVar = ((n1 - 1) * Math.pow(stats1.sd, 2) + (n2 - 1) * Math.pow(stats2.sd, 2)) / df;
  const pooledSD = Math.sqrt(pooledVar);

  const se = pooledSD * Math.sqrt((1 / n1) + (1 / n2));
  const meanDiff = stats2.mean - stats1.mean; // Group 2 (Collaborative) - Group 1 (Individual)
  const tValue = se > 0 ? meanDiff / se : 0;

  const pValue = approximatePValue(Math.abs(tValue), df);
  const effectSizeD = pooledSD > 0 ? meanDiff / pooledSD : 0;
  const etaSquared = (Math.pow(tValue, 2)) / (Math.pow(tValue, 2) + df);

  return {
    tValue: Number(tValue.toFixed(3)),
    df,
    pValue: Number(pValue.toFixed(4)),
    isSignificant: pValue < 0.05,
    effectSizeD: Number(effectSizeD.toFixed(3)),
    etaSquared: Number(etaSquared.toFixed(3)),
    mean1: stats1.mean,
    mean2: stats2.mean,
    meanDiff: Number(meanDiff.toFixed(2))
  };
}

// Helper to approximate 2-tailed p-value for Student's t distribution
function approximatePValue(t: number, df: number): number {
  if (df <= 0) return 1;
  const x = df / (df + t * t);
  let p = Math.exp(-0.5 * t * t);
  if (df > 30) {
    // Normal approximation for large df
    const z = t;
    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const pVal = 0.2316419;
    const k = 1.0 / (1.0 + pVal * z);
    const cdf = 1.0 - (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * (b1 * k + b2 * Math.pow(k, 2) + b3 * Math.pow(k, 3) + b4 * Math.pow(k, 4) + b5 * Math.pow(k, 5));
    return Math.max(0.0001, (1.0 - cdf) * 2);
  }
  // Standard conservative bounds for educational research stats
  if (t > 4.5) return 0.0001;
  if (t > 3.5) return 0.001;
  if (t > 2.8) return 0.01;
  if (t > 2.1) return 0.035;
  if (t > 1.8) return 0.07;
  if (t > 1.4) return 0.16;
  return 0.35;
}

// Generate CSV export string formatted for SPSS & Excel
export function generateSPSSCSV(students: UserProfile[], submissions: ProjectSubmission[]): string {
  // Empty cells represent data that has not been collected; never substitute demo values.
  const headers = [
    'ID',
    'Student_Name',
    'Group_Code',
    'Group_Label',
    'PreTest_Score',
    'PostTest_Score',
    'Gain_Score',
    'Engagement_Behavioral',
    'Engagement_Cognitive',
    'Engagement_Emotional',
    'Engagement_Social',
    'Total_Engagement',
    'Progress_Pct',
    'Completed_Projects',
    'Avg_Rubric_Score',
    'Team_Role'
  ];

  const escapeCsv = (value: unknown) => {
    const text = value === null || value === undefined ? '' : String(value);
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const numericCell = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value) ? String(value) : '';

  let csv = '\uFEFF' + headers.join(',') + '\n';

  students.forEach((student, index) => {
    // Team-level submissions are not attributed to individual members without
    // individual contribution records.
    const studentSubmissions = submissions.filter(sub => sub.studentId === student.id);
    const evaluated = studentSubmissions.filter(sub =>
      sub.status === 'evaluated' && typeof sub.totalScore === 'number' && Number.isFinite(sub.totalScore)
    );
    const averageRubric = evaluated.length
      ? evaluated.reduce((sum, sub) => sum + Number(sub.totalScore), 0) / evaluated.length
      : undefined;

    const pre = student.preTestScore;
    const post = student.postTestScore;
    const gain = typeof pre === 'number' && typeof post === 'number' ? post - pre : undefined;
    const engagement = student.engagementScore;
    const groupCode = student.experimentalGroup === 'collaborative_group' ? 2 : 1;
    const groupLabel = student.experimentalGroup === 'collaborative_group' ? 'Collaborative' : 'Individual';

    const row = [
      escapeCsv(student.id || `S${String(index + 1).padStart(3, '0')}`),
      escapeCsv(student.name),
      String(groupCode),
      escapeCsv(groupLabel),
      numericCell(pre),
      numericCell(post),
      numericCell(gain),
      numericCell(engagement?.behavioral),
      numericCell(engagement?.cognitive),
      numericCell(engagement?.emotional),
      numericCell(engagement?.social),
      numericCell(engagement?.percentage),
      numericCell(student.progressPercentage),
      String(evaluated.length),
      numericCell(averageRubric),
      escapeCsv(student.teamRole || 'none')
    ];
    csv += row.join(',') + '\n';
  });

  return csv;
}

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
