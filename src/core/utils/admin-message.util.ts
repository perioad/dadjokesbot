export const sendMessageToAdmin = async (message: string): Promise<void> => {
  const encodedMessage = encodeURIComponent(message);

  await fetch(
    `https://api.telegram.org/bot${process.env.ADMIN_TOKEN}/sendMessage?chat_id=${process.env.ADMIN_CHAT_ID}&text=${encodedMessage}`,
  );
};

export const sendAudioToAdmin = async (blob: Blob): Promise<string> => {
  const formData = new FormData();

  formData.append('voice', blob, 'voice.ogg');
  formData.append('chat_id', process.env.ADMIN_CHAT_ID as string);

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendVoice`,
    {
      method: 'POST',
      body: formData,
    },
  );
  const data = await response.json();
  const fileId = data?.result?.voice?.file_id;

  if (!data.ok || !fileId) {
    throw new Error(
      `Could not send audio to admin. Data: ${JSON.stringify(data)}`,
    );
  }

  return fileId as string;
};
