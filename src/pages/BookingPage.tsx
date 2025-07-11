
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, User, Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useProfessional } from "@/hooks/useProfessionals";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";

const availableTimes = [
  { date: "2024-07-08", day: "Segunda", slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  { date: "2024-07-09", day: "Terça", slots: ["08:00", "09:00", "10:00", "14:00", "15:00"] },
  { date: "2024-07-10", day: "Quarta", slots: ["09:00", "11:00", "14:00", "15:00", "16:00", "17:00"] },
  { date: "2024-07-11", day: "Quinta", slots: ["08:00", "09:00", "10:00", "11:00", "15:00", "16:00"] },
  { date: "2024-07-12", day: "Sexta", slots: ["09:00", "10:00", "14:00", "15:00", "16:00"] }
];

const BookingPage = () => {
  const { professional } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useProfessional(professional || "");
  const createAppointment = useCreateAppointment();
  const { user } = useAuth();
  
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    if (!user) {
      toast.error("Você precisa estar logado para agendar uma consulta");
      navigate("/auth");
      return;
    }

    // Pre-fill form with user data
    if (user) {
      setFormData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        phone: "",
        message: ""
      });
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
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

  const selectedServiceData = data.services?.find((s) => s.id === selectedService);
  const selectedDateData = availableTimes.find(d => d.date === selectedDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para agendar");
      return;
    }

    try {
      await createAppointment.mutateAsync({
        professional_id: data.id,
        service_id: selectedService,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        patient_name: formData.name,
        patient_email: formData.email,
        patient_phone: formData.phone,
        message: formData.message
      });

      // Navigate to confirmation page
      const bookingData = {
        professional: data.name,
        service: selectedServiceData?.name || "",
        date: selectedDate,
        time: selectedTime,
        ...formData
      };
      
      navigate(`/${professional}/confirmado`, { state: bookingData });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Erro ao criar agendamento. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to={`/${professional}`} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Agendar com {data.name}
              </h1>
              <p className="text-sm text-gray-600">{data.specialty}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <span>Selecione o Serviço</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {data.services?.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedService === service.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration} min
                          </p>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          R$ {service.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            {selectedService && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <span>Escolha Data e Horário</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Data</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {availableTimes.map((dateOption) => (
                        <button
                          key={dateOption.date}
                          type="button"
                          className={`p-3 text-center border-2 rounded-lg transition-all ${
                            selectedDate === dateOption.date
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedDate(dateOption.date);
                            setSelectedTime("");
                          }}
                        >
                          <div className="font-medium">{dateOption.day}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(dateOption.date).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit' 
                            })}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && selectedDateData && (
                    <div>
                      <Label className="text-base font-medium mb-3 block">Horário</Label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {selectedDateData.slots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`p-3 text-center border-2 rounded-lg transition-all ${
                              selectedTime === time
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Personal Information */}
            {selectedTime && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <span>Seus Dados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Nome Completo *</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>Telefone *</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>E-mail *</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Observações (opcional)</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Alguma informação adicional..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary & Submit */}
            {selectedTime && selectedServiceData && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>Resumo do Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profissional:</span>
                      <span className="font-medium">{data.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serviço:</span>
                      <span className="font-medium">{selectedServiceData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">
                        {selectedDateData?.day}, {new Date(selectedDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horário:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t">
                      <span>Total:</span>
                      <span>R$ {selectedServiceData.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={createAppointment.isPending}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    {createAppointment.isPending ? "Confirmando..." : "Confirmar Agendamento"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
