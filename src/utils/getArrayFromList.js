export const getArrayFromList = (list) => {
  if (!list) {
    return [];
  }
  if (list instanceof Array) {
    return list;
  } else return [list];
};
