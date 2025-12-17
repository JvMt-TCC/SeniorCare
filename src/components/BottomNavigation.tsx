import { Home, Calendar, MessageCircle, User, Lightbulb, Star, Heart, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const isVolunteer = profile?.user_type === 'voluntario';

  const elderNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Lightbulb, label: "Sugestões", path: "/sugestoes" },
    { icon: Heart, label: "Saúde", path: "/saude" },
    { icon: MessageCircle, label: "Mensagens", path: "/mensagens" },
  ];

  const volunteerNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Voluntariado", path: "/saude/ajuda-amigo" },
    { icon: Heart, label: "Saúde", path: "/saude" },
    { icon: MessageCircle, label: "Mensagens", path: "/mensagens" },
  ];

  const navItems = isVolunteer ? volunteerNavItems : elderNavItems;

  return (
    <nav 
      className="bottom-nav"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex justify-around items-center py-3 px-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 touch-target ${
                isActive
                  ? "text-primary bg-primary-soft scale-105"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon size={22} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
