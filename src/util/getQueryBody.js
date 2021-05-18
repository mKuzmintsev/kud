export const getQueryBody = (pathname) => {
  const result = pathname
    .split('/')
    .filter((item) => item !== '')
    .reduce((acc, item, idx) => {
      switch (idx) {
        case 0: {
          acc += `kernel=${item}`;
          break;
        }
        case 1: {
          acc += `&uuid=${item}`;
          break;
        }
        case 2: {
          acc += `&sid=${item}`;
          break;
        }
        default: {
          break;
        }
      }
      return acc;
    }, '');

  return result;
};
