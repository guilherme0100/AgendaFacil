
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfessional } from './useProfessionals';

export interface AdminAppointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  message?: string;
  service: {
    name: string;
    duration: number;
    price: number;
  };
}

export function useAdminAppointments(professionalSlug: string) {
  const { data: professional } = useProfessional(professionalSlug);

  return useQuery({
    queryKey: ['admin-appointments', professional?.id],
    queryFn: async () => {
      if (!professional?.id) {
        throw new Error('Professional not found');
      }

      console.log('Fetching admin appointments for professional:', professional.id);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (
            name,
            duration,
            price
          )
        `)
        .eq('professional_id', professional.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching admin appointments:', error);
        throw error;
      }

      console.log('Admin appointments fetched:', data);
      return data as any[];
    },
    enabled: !!professional?.id
  });
}
