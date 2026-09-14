import { apiClient, isDemoMode } from './client';
import { Complaint, CreateComplaintInput } from '@/types/complaint';
import { DEMO_COMPLAINTS } from '../demo/complaints';

// In-memory array for demo modifications during session
let currentComplaints = [...DEMO_COMPLAINTS];

export async function getComplaints(): Promise<Complaint[]> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...currentComplaints];
  }
  return apiClient<Complaint[]>('/api/complaints');
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const found = currentComplaints.find(
      (c) => c.id === id || c.trackingNumber.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  }
  return apiClient<Complaint>(`/api/complaints/${id}`);
}

export async function createComplaint(input: CreateComplaintInput): Promise<Complaint> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTracking = `RV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      trackingNumber: newTracking,
      category: input.category,
      stationName: input.stationName,
      stationCode: input.stationCode,
      platformNumber: input.platformNumber,
      priority: input.priority,
      status: 'submitted',
      description: input.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hasAttachment: !!input.attachment,
      attachmentName: input.attachment ? input.attachment.name : undefined,
      timeline: [
        {
          id: `t-${Date.now()}`,
          status: 'submitted',
          timestamp: new Date().toISOString(),
          description: 'Grievance recorded via RailVision Assistant (Demo Registration).',
          actor: 'Passenger (You)',
        },
      ],
    };

    currentComplaints = [newComplaint, ...currentComplaints];
    return newComplaint;
  }

  const formData = new FormData();
  formData.append('category', input.category);
  formData.append('stationName', input.stationName);
  formData.append('stationCode', input.stationCode);
  if (input.platformNumber) formData.append('platformNumber', String(input.platformNumber));
  formData.append('priority', input.priority);
  formData.append('description', input.description);
  if (input.attachment) formData.append('attachment', input.attachment);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/complaints`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to submit complaint to server');
  return res.json();
}
