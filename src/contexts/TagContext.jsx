import  { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTag } from '../hooks/useTag';

const TagContext = createContext(null);

export function TagProvider({ children }) {
  const tagState = useTag();
  return (
    <TagContext.Provider value={tagState}>
      {children}
    </TagContext.Provider>
  );
}

TagProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useTagContext() {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTagContext must be used within a TagProvider');
  }
  return context;
}