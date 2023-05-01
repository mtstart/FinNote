export const withModifyingKey = (event: KeyboardEvent) =>
  event.shiftKey || event.metaKey || event.altKey || event.ctrlKey;

export const targetingInputElement = (event: Event) =>
  event.target instanceof HTMLInputElement ||
  event.target instanceof HTMLTextAreaElement ||
  event.target instanceof HTMLButtonElement;

export const stopEvent = (event: Event) => {
  event.stopImmediatePropagation();
  event.stopPropagation();
  event.preventDefault();
};
