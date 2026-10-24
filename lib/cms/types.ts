export type CmsStatus = "draft" | "published";
export type AchievementKind = "certificate" | "award";

export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string | null;
  category: string;
  tags: string[];
  imageUrl: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  badge: string | null;
  status: CmsStatus;
  sortOrder: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Experience = {
  id: string;
  role: string;
  organization: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  icon: string;
  status: CmsStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  yearsLabel: string;
  proficiency: number;
  icon: string;
  status: CmsStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Achievement = {
  id: string;
  kind: AchievementKind;
  title: string;
  issuer: string;
  issuedAt: string | null;
  imageUrl: string | null;
  credentialUrl: string | null;
  description: string | null;
  status: CmsStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CmsStats = {
  projects: number;
  experiences: number;
  skills: number;
  achievements: number;
  drafts: number;
  published: number;
};
