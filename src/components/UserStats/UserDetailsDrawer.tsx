import React from "react";
import Drawer from "../ui/Drawer";
import { UserAnalyticsCards } from "./UserAnalyticsCards";
import { UserQuizHistoryTable } from "./UserQuizHistoryTable";

interface User {
  uid: string;
  displayName?: string;
  email: string;
}

interface UserDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedUser: User | null;
  history: any;
  historyLoading: boolean;
  historyError: string | null;
  quizzes: any[];
}

export function UserDetailsDrawer({
  open,
  onClose,
  selectedUser,
  history,
  historyLoading,
  historyError,
  quizzes,
}: UserDetailsDrawerProps) {
  const getDrawerTitle = () => {
    if (!selectedUser) return "User Quiz History";
    return `${selectedUser.displayName || selectedUser.email}'s Quiz History`;
  };

  const renderDrawerContent = () => {
    if (historyLoading) {
      return <div className="p-6 text-center">Loading quiz history...</div>;
    }

    if (historyError) {
      return <div className="p-6 text-center text-red-500">{historyError}</div>;
    }

    if (!history || history.results.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No quiz history for this user.
        </div>
      );
    }

    return (
      <>
        <UserAnalyticsCards history={history} />
        <UserQuizHistoryTable results={history.results} quizzes={quizzes} />
      </>
    );
  };

  return (
    <Drawer open={open} onClose={onClose} title={getDrawerTitle()}>
      {renderDrawerContent()}
    </Drawer>
  );
}