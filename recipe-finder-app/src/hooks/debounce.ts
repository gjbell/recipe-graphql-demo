export function debounce(func: () => {}, delay: number): () => void {
  let timer: NodeJS.Timeout | null;

  return (): void => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func();
    }, delay);
  };
}
