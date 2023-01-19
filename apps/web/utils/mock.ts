export const useQuery = (_data: any, _query: any) => {
  return {
    data: {} as any,
    refetch: () => {},
  };
};

export const useMutation = (_data: any) => {
  const response = [async () => {}, { loading: false }];
  return response as [(_data: any) => Promise<any>, { loading: boolean }];
};

export const gql = (...query: any) => {
  return query;
};
