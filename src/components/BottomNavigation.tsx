import { Home, Calendar, MessageCircle, User, Lightbulb } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Lightbulb, label: "Sugestões", path: "/sugestoes" },
    { icon: Calendar, label: "Calendário", path: "/calendario" },
    { icon: MessageCircle, label: "Mensagens", path: "/mensagens" },
    { icon: User, label: "Perfil", path: "/perfil" },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-primary bg-primary-soft scale-105"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;