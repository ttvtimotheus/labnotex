// Core types for the application
export type User = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'user' | 'trainer' | 'admin';
  organization?: string;
}

export type Experiment = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: 'draft' | 'completed' | 'archived';
  isPublic: boolean;
  favorited: boolean;
}

export type TrainingEntry = {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  type: 'practical' | 'theory';
  status: 'draft' | 'completed' | 'evaluated';
  rating?: number;
  userId: string;
  supervisorId?: string;
  examRelevant: boolean;
}

export type ToolResult = {
  id: string;
  toolType: string;
  data: any;
  userId: string;
  createdAt: string;
  name: string;
}

export type PCRPrimer = {
  id: string;
  name: string;
  sequence: string;
  tm: number;
  gcContent: number;
  length: number;
  direction: 'forward' | 'reverse';
}

export type FileAttachment = {
  id: string;
  experimentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  userId: string;
}
