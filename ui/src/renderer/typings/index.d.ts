interface Window {
  initializeSuccess?: boolean;
  navigate?: (path: any, routerOptions: any) => Promise<void>;
}
