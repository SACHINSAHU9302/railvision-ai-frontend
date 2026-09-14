import { apiClient, isDemoMode } from './client';
import { ExtractedTicketResult } from '@/types/ticket';
import { DEMO_EXTRACTED_TICKET } from '../demo/ticket';

export async function uploadAndExtractTicket(file: File): Promise<ExtractedTicketResult> {
  if (isDemoMode()) {
    // Artificial extraction delay to demonstrate progress UI
    await new Promise((resolve) => setTimeout(resolve, 900));
    return {
      ...DEMO_EXTRACTED_TICKET,
      rawTextPreview: `[Demo Scan of ${file.name}]\n${DEMO_EXTRACTED_TICKET.rawTextPreview}`,
    };
  }

  const formData = new FormData();
  formData.append('ticketFile', file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ticket/extract`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Ticket extraction failed on remote OCR service');
  return res.json();
}

export async function getSampleDemoTicket(): Promise<ExtractedTicketResult> {
  return DEMO_EXTRACTED_TICKET;
}
