
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log('Webhook payload:', payload)

    // Verify it's an INSERT operation on appointments table
    if (payload.type === 'INSERT' && payload.table === 'appointments') {
      const appointment = payload.record
      
      // Get professional and service details
      const { data: professional } = await supabase
        .from('professionals')
        .select('name')
        .eq('id', appointment.professional_id)
        .single()

      const { data: service } = await supabase
        .from('services')
        .select('name')
        .eq('id', appointment.service_id)
        .single()

      if (professional && service) {
        // Call the email function
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-appointment-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            to: appointment.patient_email,
            professionalName: professional.name,
            serviceName: service.name,
            appointmentDate: appointment.appointment_date,
            appointmentTime: appointment.appointment_time,
            patientName: appointment.patient_name,
          }),
        })

        console.log('Email sent:', await emailResponse.text())
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
