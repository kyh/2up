export const collectConnectionNodes = <T>(
  connectionObj:
    | null
    | undefined
    | {
        edges: null | ({ node: null | T } | null)[];
      }
) => {
  if (connectionObj && connectionObj.edges && connectionObj.edges.length > 0) {
    return connectionObj.edges.reduce((acc, curr) => {
      if (curr && curr.node) {
        acc.push(curr.node);
      }

      return acc;
    }, [] as T[]);
  }

  return [];
};
