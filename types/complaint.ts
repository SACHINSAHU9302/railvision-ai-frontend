export type ComplaintCategory =
  | 'cleanliness'
  | 'security'
  | 'ticket_harassment'
  | 'water_electricity'
  | 'catering'
  | 'medical_emergency'
  | 'staff_behavior'
  | 'other';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved';

export interface ComplaintTimelineEvent {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  description: string;
  actor: string;
}

export interface Complaint {
  id: string;
  trackingNumber: string;
  category: ComplaintCategory;
  stationName: string;
  stationCode: string;
  platformNumber?: number;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  timeline: ComplaintTimelineEvent[];
}

export interface CreateComplaintInput {
  category: ComplaintCategory;
  stationName: string;
  stationCode: string;
  platformNumber?: number;
  priority: ComplaintPriority;
  description: string;
  attachment?: File | null;
}
