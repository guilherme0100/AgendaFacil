
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateAppointmentData {
  professional_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  message?: string;
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      console.log('Creating appointment:', data);
      
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }

      console.log('Appointment created:', appointment);
      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento realizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Appointment creation failed:', error);
      toast.error('Erro ao realizar agendamento. Tente novamente.');
    }
  });
}
