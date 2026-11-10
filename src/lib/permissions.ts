import type { UserRole } from '../types/schema';

/**
 * Central role policy for the Edu-K platform.
 *
 * platform_admin: full platform administration.
 * academic_supervisor: read-only access to academic data.
 * researcher: may create and edit academic/research content, but cannot
 * administer accounts, roles, or platform security/settings.
 *
 * teacher_admin is a legacy role and intentionally receives no elevated
 * permissions. Existing accounts must be explicitly migrated to a new role.
 */

export const isPlatformAdmin = (role: UserRole | null | undefined): boolean =>
  role === 'platform_admin';

export const isAcademicSupervisor = (role: UserRole | null | undefined): boolean =>
  role === 'academic_supervisor';

export const isResearcher = (role: UserRole | null | undefined): boolean =>
  role === 'researcher';

export const canViewAcademicData = (role: UserRole | null | undefined): boolean =>
  role === 'platform_admin' ||
  role === 'academic_supervisor' ||
  role === 'researcher' ||
  role === 'teacher_admin' ||
  role === 'student_individual' ||
  role === 'student_collaborative';

export const canEditAcademicContent = (role: UserRole | null | undefined): boolean =>
  role === 'platform_admin' || role === 'researcher';

export const canManageUsers = (role: UserRole | null | undefined): boolean =>
  role === 'platform_admin';

export const canManagePlatformSettings = (role: UserRole | null | undefined): boolean =>
  role === 'platform_admin';

export const canDeleteAcademicContent = (role: UserRole | null | undefined): boolean =>
  role === 'platform_admin';

export const isReadOnlyRole = (role: UserRole | null | undefined): boolean =>
  role === 'academic_supervisor';
