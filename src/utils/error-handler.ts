export const handleError = (functionName: string, error: any) => {
  if (!error) {
    console.error(`ERROR in ${functionName}: `, 'good luck :)');
  } else {
    const info: any = {};

    if (error.status) {
      info.status = error.status;
    }

    if (error.code) {
      info.code = error.code;
    }

    if (error.message) {
      info.message = error.message;
    }

    console.error(
      `ERROR in ${functionName}: `,
      Object.values(info).length === 0 ? error : info,
    );
  }
};
