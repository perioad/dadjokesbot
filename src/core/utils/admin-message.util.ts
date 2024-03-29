export const sendMessageToAdmin = async (message: string): Promise<void> => {
  await fetch(
    `https://api.telegram.org/bot${process.env.ADMIN_TOKEN}/sendMessage?chat_id=${process.env.ADMIN_CHAT_ID}&text=${message}`,
  );
};
