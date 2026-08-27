import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface MembershipModalContextType {
  isModalOpen: boolean;
  openMembershipModal: () => void;
  closeMembershipModal: () => void;
}

const MembershipModalContext = createContext<MembershipModalContextType | undefined>(undefined);

export const MembershipModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMembershipModal = () => setIsModalOpen(true);
  const closeMembershipModal = () => setIsModalOpen(false);

  return (
    <MembershipModalContext.Provider value={{ isModalOpen, openMembershipModal, closeMembershipModal }}>
      {children}
    </MembershipModalContext.Provider>
  );
};

export const useMembershipModal = (): MembershipModalContextType => {
  const context = useContext(MembershipModalContext);
  if (!context) {
    throw new Error('useMembershipModal must be used within a MembershipModalProvider');
  }
  return context;
};
