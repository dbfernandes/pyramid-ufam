import { createContext, useContext, useState } from 'react';
import { IBreadcrumbContext, IBreadcrumbContextProvider } from './types';

// Interfaces
import { ILink } from './types';

const DEFAULT: IBreadcrumbContext = {
  links: [],
  setLinks: () => { },
};

const BreadcrumbContext = createContext<IBreadcrumbContext>(DEFAULT);

// Hook
export const useBreadcrumb = () => {
  return useContext(BreadcrumbContext);
};

// Provider
export default function BreadcrumbContextProvider({
  children
}: IBreadcrumbContextProvider) {
  const [links, setLinks] = useState<ILink[]>(DEFAULT.links);

  const values: IBreadcrumbContext = {
    links,
    setLinks
  };

  return <BreadcrumbContext.Provider value={values}>{children}</BreadcrumbContext.Provider>;
}
