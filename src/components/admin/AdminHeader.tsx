
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  professionalSlug: string;
  professionalName: string;
  professionalSpecialty: string;
}

export const AdminHeader = ({ 
  professionalSlug, 
  professionalName, 
  professionalSpecialty 
}: AdminHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to={`/${professionalSlug}`} 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Ver Perfil</span>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600">
                {professionalName} - {professionalSpecialty}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
