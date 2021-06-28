export const collectConnectionNodes = <T extends { id?: string }>(
  connectionObj:
    | null
    | undefined
    | {
        edges: null | ({ node: null | T } | null)[];
      }
) => {
  if (connectionObj && connectionObj.edges && connectionObj.edges.length > 0) {
    return connectionObj.edges.reduce((acc, curr, i) => {
      if (curr && curr.node) {
        if (curr.node.id) {
          acc[curr.node.id] = curr.node;
        } else {
          acc[i] = curr.node;
        }
      }
      return acc;
    }, {} as Record<string, T>);
  }

  return {};
};
