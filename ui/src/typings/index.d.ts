declare interface Window {
  addEventListener(
    type: 'vite:preloadError',
    listener: (this: Window, ev: VitePreloadErrorEvent) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: 'vite:preloadError',
    listener: (this: Window, ev: VitePreloadErrorEvent) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
  initializeSuccess?: boolean;
}
