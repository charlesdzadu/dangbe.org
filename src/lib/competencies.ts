import type { ComponentType } from 'react';
import { Laptop, Lightbulb, Puzzle, RefreshCw, Users, Workflow, type IconProps } from '@/components/icons';

export type SkillKey = 'digital' | 'critical' | 'problem' | 'logic' | 'team' | 'adapt';

/** The glyph each competency carries on the site (the words live in i18n). */
export const SKILL_ICONS: Record<SkillKey, ComponentType<IconProps>> = {
  digital: Laptop,
  critical: Lightbulb,
  problem: Puzzle,
  logic: Workflow,
  team: Users,
  adapt: RefreshCw,
};

export const SKILL_KEYS: readonly SkillKey[] = ['digital', 'critical', 'problem', 'logic', 'team', 'adapt'];
