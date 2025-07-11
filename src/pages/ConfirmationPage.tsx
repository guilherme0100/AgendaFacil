
import { useLocation, Link, useParams } from "react-router-dom";
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ConfirmationPage = () => {
  const location = useLocation();
  const { professional } = useParams();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Agendamento não encontrado</h1>
          <Link to="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-900">AgendaFácil</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agendamento Confirmado!
            </h1>
            <p className="text-xl text-gray-600">
              Seu horário foi reservado com sucesso. Você receberá um e-mail de confirmação em breve.
            </p>
          </div>

          {/* Booking Details */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-green-600">
                Detalhes do Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Professional Info */}
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {bookingData.professional}
                </h3>
                <p className="text-lg text-green-600 font-medium">
                  {bookingData.service}
                </p>
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Data</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(bookingData.date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Horário</p>
                    <p className="font-semibold text-gray-900">{bookingData.time}</p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Seus Dados</h4>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{bookingData.name}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{bookingData.email}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{bookingData.phone}</span>
                </div>

                {bookingData.message && (
                  <div className="flex items-start space-x-3 pt-2">
                    <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Observações:</p>
                      <p className="text-gray-700">{bookingData.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="border-0 bg-yellow-50 border-yellow-200 mb-8">
            <CardHeader>
              <CardTitle className="text-yellow-800">Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-700 space-y-2">
              <p>• Um e-mail de confirmação será enviado para {bookingData.email}</p>
              <p>• Chegue 10 minutos antes do horário marcado</p>
              <p>• Traga um documento de identificação</p>
              <p>• Em caso de cancelamento, entre em contato com até 24h de antecedência</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Home className="h-5 w-5 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
            
            <Link to={`/${professional}`}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Perfil do Profissional
              </Button>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-12 p-6 bg-white/60 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Precisa de Ajuda?</h3>
            <p className="text-gray-600 mb-4">
              Entre em contato conosco se tiver alguma dúvida sobre seu agendamento.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
              <span className="text-gray-600">📧 suporte@agendafacil.com.br</span>
              <span className="text-gray-600">📱 (11) 9999-0000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
