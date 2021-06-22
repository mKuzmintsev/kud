export const getItemsFromJson = (jsonData: any): any[] => {
  if (!jsonData) {
    return [];
  }
  if (jsonData instanceof Array) {
    return jsonData;
  } else return [jsonData];
};
