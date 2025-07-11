
import { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { professional } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { data: hasAccess, isLoading: accessLoading, error } = useAdminAccess(professional || '');

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg">Verificando autenticação...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mostrar loading enquanto verifica permissões
  if (accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center p-8">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-lg">Verificando permissões...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar erro se houver problema na verificação
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro de Verificação</h2>
            <p className="text-gray-600 mb-4">
              Não foi possível verificar suas permissões de acesso.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Tentar novamente
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Negar acesso se não tiver permissão
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-96 border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Shield className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar este painel administrativo.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Entre em contato com o administrador para solicitar acesso.
            </p>
            <button 
              onClick={() => window.history.back()} 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Voltar
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar conteúdo se tiver acesso
  return <>{children}</>;
}
