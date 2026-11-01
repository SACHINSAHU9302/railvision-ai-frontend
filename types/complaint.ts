// ============================================
// COMPLAINT CATEGORY
// ============================================

export type ComplaintCategory =
  | 'cleanliness'
  | 'security'
  | 'ticket_harassment'
  | 'water_electricity'
  | 'catering'
  | 'medical_emergency'
  | 'staff_behavior'
  | 'other';

export const COMPLAINT_CATEGORIES: {
  value: ComplaintCategory;
  label: string;
}[] = [
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'security', label: 'Security' },
  { value: 'ticket_harassment', label: 'Ticket Harassment' },
  { value: 'water_electricity', label: 'Water & Electricity' },
  { value: 'catering', label: 'Catering' },
  { value: 'medical_emergency', label: 'Medical Emergency' },
  { value: 'staff_behavior', label: 'Staff Behavior' },
  { value: 'other', label: 'Other' },
];

// ============================================
// COMPLAINT PRIORITY
// ============================================

export type ComplaintPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export const COMPLAINT_PRIORITIES: {
  value: ComplaintPriority;
  label: string;
}[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

// ============================================
// COMPLAINT STATUS
// ============================================

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved';

export const COMPLAINT_STATUSES: {
  value: ComplaintStatus;
  label: string;
}[] = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

// ============================================
// COMPLAINT TIMELINE
// ============================================

export interface ComplaintTimelineEvent {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  description: string;
  actor: string;
}

// ============================================
// COMPLAINT
// ============================================

export interface Complaint {
  id: string;

  // Complaint identification
  trackingNumber: string;
  trackingId?: string;

  // Complaint details
  category: ComplaintCategory;
  title?: string;
  description: string;

  // Station details
  stationName: string;
  stationCode: string;
  platformNumber?: number;
  platform?: number;

  // Priority and status
  priority: ComplaintPriority;
  urgency?: 'normal' | 'high' | 'emergency';
  status: ComplaintStatus;

  // Contact and assignment
  contactPhone?: string;
  assignedTo?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Attachments
  hasAttachment?: boolean;
  attachmentName?: string;

  // Timeline
  timeline: ComplaintTimelineEvent[];
}

// ============================================
// CREATE COMPLAINT INPUT
// ============================================

export interface CreateComplaintInput {
  category: ComplaintCategory;
  stationName: string;
  stationCode: string;
  platformNumber?: number;
  priority: ComplaintPriority;
  description: string;
  attachment?: File | null;
}