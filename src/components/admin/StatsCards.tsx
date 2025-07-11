
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminAppointment } from "@/hooks/useAdminAppointments";

interface StatsCardsProps {
  appointments: AdminAppointment[];
}

export const StatsCards = ({ appointments }: StatsCardsProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointment_date === today).length;
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(apt => 
    apt.status === "confirmed" || apt.status === "scheduled"
  ).length;
  const revenue = appointments
    .filter(apt => apt.status === "confirmed" || apt.status === "completed")
    .reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{todayAppointments}</div>
          <p className="text-xs text-muted-foreground">agendamentos</p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalAppointments}</div>
          <p className="text-xs text-muted-foreground">agendamentos</p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{confirmedAppointments}</div>
          <p className="text-xs text-muted-foreground">agendamentos</p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">R$ {revenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">total</p>
        </CardContent>
      </Card>
    </div>
  );
};
