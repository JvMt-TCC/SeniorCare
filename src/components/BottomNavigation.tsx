import { Home, Calendar, MessageCircle, User, Lightbulb, Star } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Lightbulb, label: "Sugestões", path: "/sugestoes" },
    { icon: Star, label: "Eventos", path: "/meus-eventos" },
    { icon: Calendar, label: "Calendário", path: "/calendario" },
    { icon: User, label: "Perfil", path: "/perfil" },
  ];

  return (
    <nav className="bottom-nav safe-area-bottom">
      <div className="flex justify-around items-center py-3 px-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300 touch-target ${
                isActive
                  ? "text-primary bg-primary-soft scale-105"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon size={28} className="mb-2" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;