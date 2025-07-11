
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
  to: string
  professionalName: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
  patientName: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, professionalName, serviceName, appointmentDate, appointmentTime, patientName }: EmailRequest = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY não configurada')
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center;">
          <h1>🗓️ AgendaFácil</h1>
          <h2>Agendamento Confirmado!</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <p>Olá <strong>${patientName}</strong>,</p>
          
          <p>Seu agendamento foi confirmado com sucesso! Aqui estão os detalhes:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3B82F6; margin-top: 0;">Detalhes do Agendamento</h3>
            <p><strong>Profissional:</strong> ${professionalName}</p>
            <p><strong>Serviço:</strong> ${serviceName}</p>
            <p><strong>Data:</strong> ${new Date(appointmentDate).toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Horário:</strong> ${appointmentTime}</p>
          </div>
          
          <div style="background-color: #EFF6FF; padding: 15px; border-radius: 8px; border-left: 4px solid #3B82F6;">
            <p style="margin: 0;"><strong>Importante:</strong> Chegue com 15 minutos de antecedência.</p>
          </div>
          
          <p style="margin-top: 30px;">
            Se precisar cancelar ou reagendar, entre em contato conosco com antecedência.
          </p>
          
          <p>Obrigado por escolher o AgendaFácil!</p>
        </div>
        
        <div style="background-color: #1F2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 AgendaFácil - Todos os direitos reservados</p>
        </div>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'AgendaFácil <noreply@agendafacil.com>',
        to: [to],
        subject: `Agendamento Confirmado - ${serviceName}`,
        html: emailHtml,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      const error = await res.text()
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
