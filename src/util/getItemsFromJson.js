export const getItemsFromJson = (jsonData) => {
  if (!jsonData) {
    return [];
  }
  if (jsonData instanceof Array) {
    return jsonData;
  } else return [jsonData];
};
