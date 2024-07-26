const wait = (timeInSeconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeInSeconds * 1000);
  });
};

export default wait;
