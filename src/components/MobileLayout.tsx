import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import FixedChat from "./FixedChat";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="mobile-container">
      <main className="pb-20 p-4 fade-in min-h-screen">
        {children}
      </main>
      <FixedChat />
      <BottomNavigation />
    </div>
  );
};

export default MobileLayout;