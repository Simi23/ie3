export const useLoadingSpinner = () => {
  return useState<boolean>("loadingSpinner", () => false);
};
