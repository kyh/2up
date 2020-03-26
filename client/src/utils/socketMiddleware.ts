const WHITELIST_EVENTS = ['playhouse', 'game'].join('|');

export const socketMiddleware = (_store: any) => (next: any) => (
  action: any
) => {
  const reg = new RegExp(WHITELIST_EVENTS, 'gi');
  if (reg.test(action.type)) {
    next(action);
  }
};
