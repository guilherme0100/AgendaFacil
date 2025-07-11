
import { Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminAppointment } from "@/hooks/useAdminAppointments";

interface RecentAppointmentsProps {
  appointments: AdminAppointment[];
  isLoading: boolean;
}

export const RecentAppointments = ({ appointments, isLoading }: RecentAppointmentsProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Próximos Agendamentos</CardTitle>
        <CardDescription>Seus próximos compromissos</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum agendamento encontrado
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.patient_name}</p>
                    <p className="text-sm text-gray-600">{appointment.service?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">{appointment.appointment_time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
