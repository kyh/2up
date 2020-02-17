import { useLocation } from 'react-router-dom';
import { parse } from 'query-string';

export const useQueryParams = () => {
  const location = useLocation();
  return parse(location.search);
};
