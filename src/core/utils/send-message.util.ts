export const sendMessage = async (
  chatId: string,
  message: string,
): Promise<void> => {
  await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${message}`,
  );
};
