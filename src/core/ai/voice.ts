import { sendAudioToAdmin } from '../utils/admin-message.util';
import { handleError } from '../utils/error-handler.util';

export const voiceText = async (text: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_VOICE_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VOICE_MODEL,
        voice: process.env.OPENAI_VOICE,
        response_format: 'opus',
        input: text,
      }),
    });
    const blob = await response.blob();

    return await sendAudioToAdmin(blob);
  } catch (error) {
    await handleError('voiceText', error);
  }
};
