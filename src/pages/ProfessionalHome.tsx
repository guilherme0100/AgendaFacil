
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Star, Phone, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfessional } from "@/hooks/useProfessionals";
import { useAuth } from "@/hooks/useAuth";

const ProfessionalHome = () => {
  const { professional } = useParams();
  const { data, isLoading, error } = useProfessional(professional || "");
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando profissional...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profissional não encontrado</h1>
          <Link to="/">
            <Button>Voltar ao Início</Button>
          </Link>
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
            <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">AgendaFácil</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Professional Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src={data.image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"}
                    alt={data.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-3xl">{data.name}</CardTitle>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {data.specialty}
                      </Badge>
                    </div>
                    <CardDescription className="text-lg mb-4">
                      {data.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{data.rating || 4.8}</span>
                        <span>({data.reviews_count || 0} avaliações)</span>
                      </div>
                      {data.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{data.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* About */}
            {data.about && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Sobre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{data.about}</p>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {data.services && data.services.length > 0 && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.services.map((service) => (
                      <div key={service.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration} min
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-blue-600">
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Quick Booking */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg sticky top-24">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-600">Agendar Consulta</CardTitle>
                <CardDescription>
                  {user ? "Selecione o melhor horário para você" : "Faça login para agendar"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <Link to={`/${professional}/agendar`}>
                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Calendar className="h-5 w-5 mr-2" />
                      Agendar Agora
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Calendar className="h-5 w-5 mr-2" />
                      Fazer Login para Agendar
                    </Button>
                  </Link>
                )}
                
                {data.schedule && (
                  <div className="text-center text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>{data.schedule}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="break-all">{data.email}</span>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{data.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHome;
