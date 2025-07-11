
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminAppointment } from "@/hooks/useAdminAppointments";
import { AppointmentsFilters } from "./AppointmentsFilters";
import { AppointmentsList } from "./AppointmentsList";

interface AppointmentsTabProps {
  appointments: AdminAppointment[];
  isLoading: boolean;
}

export const AppointmentsTab = ({ appointments, isLoading }: AppointmentsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todos");

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || appointment.status === statusFilter;
    const matchesDate = dateFilter === "todos" || appointment.appointment_date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const uniqueDates = [...new Set(appointments.map(apt => apt.appointment_date))].sort();

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <CardTitle>Gerenciar Agendamentos</CardTitle>
            <CardDescription>Visualize e gerencie todos os seus agendamentos</CardDescription>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AppointmentsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          uniqueDates={uniqueDates}
        />

        <AppointmentsList
          appointments={filteredAppointments}
          isLoading={isLoading}
          isEmpty={filteredAppointments.length === 0}
          emptyMessage={appointments.length === 0 ? 'Nenhum agendamento encontrado' : 'Nenhum agendamento corresponde aos filtros'}
        />
      </CardContent>
    </Card>
  );
};
