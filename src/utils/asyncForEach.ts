export async function asyncForEach(
  arr: any[],
  callback: (item: any, index: number, array: any[]) => void
): Promise<void> {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i], i, arr);
  }
}
