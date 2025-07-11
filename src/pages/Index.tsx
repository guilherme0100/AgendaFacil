
import { Link } from "react-router-dom";
import { Calendar, Clock, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { data: professionals, isLoading, error } = useProfessionals();
  const { user, signOut, loading: authLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar profissionais</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AgendaFácil</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                <a href="#como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Como Funciona
                </a>
                <a href="#profissionais" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Profissionais
                </a>
              </nav>
              
              {!authLoading && (
                <div className="flex items-center space-x-2">
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        Olá, {user.user_metadata?.name || user.email}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={signOut}
                        className="flex items-center space-x-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Entrar</span>
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Agende sua consulta <span className="text-blue-600">facilmente</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Encontre o profissional ideal e agende sua consulta em poucos cliques. 
            Simples, rápido e seguro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href="#profissionais">Ver Profissionais</a>
            </Button>
            <Button size="lg" variant="outline">
              Sou Profissional
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="como-funciona" className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como Funciona
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Escolha o Profissional</h4>
              <p className="text-gray-600">Encontre o especialista que você precisa</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Selecione Data e Hora</h4>
              <p className="text-gray-600">Veja os horários disponíveis em tempo real</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Confirme seu Agendamento</h4>
              <p className="text-gray-600">Receba confirmação instantânea</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals */}
      <section id="profissionais" className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nossos Profissionais
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {professionals?.map((professional) => (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <img
                    src={professional.image_url || `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face`}
                    alt={professional.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle>{professional.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {professional.specialty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">{professional.description}</p>
                  <Link to={`/${professional.slug}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Ver Perfil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-6 w-6" />
            <span className="text-xl font-semibold">AgendaFácil</span>
          </div>
          <p className="text-gray-400">
            © 2024 AgendaFácil. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
