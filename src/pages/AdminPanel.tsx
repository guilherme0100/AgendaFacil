
import { useParams, Link } from "react-router-dom";
import { Calendar, TrendingUp, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfessional } from "@/hooks/useProfessionals";
import { useAdminAppointments } from "@/hooks/useAdminAppointments";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { RecentAppointments } from "@/components/admin/RecentAppointments";
import { AppointmentsTab } from "@/components/admin/AppointmentsTab";
import { PlaceholderTab } from "@/components/admin/PlaceholderTab";
import { Button } from "@/components/ui/button";

const AdminPanel = () => {
  const { professional: professionalSlug = "" } = useParams();
  const { data: professional, isLoading: profesionalLoading } = useProfessional(professionalSlug);
  const { data: appointments = [], isLoading: appointmentsLoading } = useAdminAppointments(professionalSlug);

  if (profesionalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!professional) {
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
      <AdminHeader
        professionalSlug={professionalSlug}
        professionalName={professional.name}
        professionalSpecialty={professional.specialty}
      />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="analytics">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatsCards appointments={appointments} />
            <RecentAppointments 
              appointments={appointments} 
              isLoading={appointmentsLoading} 
            />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <AppointmentsTab 
              appointments={appointments}
              isLoading={appointmentsLoading}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <PlaceholderTab
              title="Calendário"
              description="Visualização em calendário dos seus agendamentos"
              icon={Calendar}
              message="Calendário em Desenvolvimento"
              subtitle="A visualização em calendário estará disponível em breve."
            />
          </TabsContent>

          <TabsContent value="analytics">
            <PlaceholderTab
              title="Relatórios e Análises"
              description="Acompanhe o desempenho dos seus agendamentos"
              icon={TrendingUp}
              message="Relatórios em Desenvolvimento"
              subtitle="Dashboard de análises e relatórios detalhados em breve."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
