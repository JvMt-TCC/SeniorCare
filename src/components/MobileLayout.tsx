import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import FixedChat from "./FixedChat";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="mobile-container">
      <main className="pb-24 px-4 pt-safe-top fade-in min-h-screen mobile-scroll">
        {children}
      </main>
      <FixedChat />
      <BottomNavigation />
    </div>
  );
};

export default MobileLayout;