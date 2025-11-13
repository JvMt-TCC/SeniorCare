import { Home, Calendar, MessageCircle, User, Lightbulb, Star, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Lightbulb, label: "Sugestões", path: "/sugestoes" },
    { icon: Heart, label: "Saúde", path: "/saude" },
    { icon: MessageCircle, label: "Mensagens", path: "/mensagens" },
  ];

  return (
    <nav className="bottom-nav safe-area-bottom">
      <div className="flex justify-around items-center py-2 px-2 overflow-x-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 touch-target min-w-fit ${
                isActive
                  ? "text-primary bg-primary-soft scale-105"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;