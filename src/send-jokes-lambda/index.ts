export const handler = async (event: any) => {
  console.log('it works', JSON.stringify(event));

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };

  return response;
};
