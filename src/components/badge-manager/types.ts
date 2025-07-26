// components/badge-manager/types.ts
export interface Badge {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface BadgeFormData extends Partial<Badge> {}