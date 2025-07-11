import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Professional {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  description?: string;
  image_url?: string;
  rating?: number;
  reviews_count?: number;
  location?: string;
  phone?: string;
  email?: string;
  schedule?: string;
  about?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  professional_id: string;
}

export function useProfessionals() {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      console.log('Fetching professionals...');
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .not('specialty', 'eq', 'admin') // Excluir profissionais com specialty = 'admin'
        .not('name', 'ilike', '%admin%') // Excluir nomes que contenham 'admin'
        .order('name');

      if (error) {
        console.error('Error fetching professionals:', error);
        throw error;
      }

      console.log('Professionals fetched:', data);
      return data as Professional[];
    }
  });
}

export function useProfessional(slug: string) {
  return useQuery({
    queryKey: ['professional', slug],
    queryFn: async () => {
      console.log('Fetching professional:', slug);
      const { data, error } = await supabase
        .from('profissionais')
        .select(`
          *,
          services (*)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching professional:', error);
        throw error;
      }

      console.log('Professional fetched:', data);
      return data as Professional & { services: Service[] };
    },
    enabled: !!slug
  });
}
