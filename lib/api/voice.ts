import { apiClient, isDemoMode, BackendConnectionError } from './client';

export interface VoiceProcessResult {
  transcript: string;
  assistantResponse: string;
  audioResponseUrl?: string;
}

export async function processVoiceRequest(_audioBlob: Blob): Promise<VoiceProcessResult> {
  if (isDemoMode()) {
    // In demo mode, voice processing indicates clear backend status requirement
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      transcript: 'Where is the nearest waiting room at New Delhi station?',
      assistantResponse: 'The IRCTC Executive Lounge and Waiting Room is at Platform 1, Paharganj Concourse (First Floor).',
    };
  }

  // If real API mode, post audio blob to endpoint
  try {
    const formData = new FormData();
    formData.append('audio', _audioBlob, 'speech.wav');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voice/process`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Voice service failed');
    return res.json();
  } catch {
    throw new BackendConnectionError('Speech-to-text / Audio processing backend is not connected yet.');
  }
}
