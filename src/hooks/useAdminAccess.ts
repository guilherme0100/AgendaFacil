
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useAdminAccess(professionalSlug: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-access', user?.id, professionalSlug],
    queryFn: async () => {
      if (!user) {
        return false;
      }

      console.log('Checking admin access for:', user.id, professionalSlug);
      
      const { data, error } = await supabase.rpc('has_admin_access', {
        user_uuid: user.id,
        professional_slug: professionalSlug
      });

      if (error) {
        console.error('Error checking admin access:', error);
        throw error;
      }

      console.log('Admin access result:', data);
      return data as boolean;
    },
    enabled: !!user && !!professionalSlug
  });
}
