export function safeReturnPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/perfil'
  if (/^\/(login|registro|recuperar|restablecer|auth)(\/|\?|#|$)/.test(value)) return '/perfil'
  return value
}
export function authError(error) {
  const code = error?.code
  if (code === 'invalid_credentials') return 'El correo o la contraseña no son correctos.'
  if (code === 'email_not_confirmed') return 'Confirmá tu correo antes de ingresar. Revisá también la carpeta de spam.'
  if (code === 'user_already_exists' || code === 'email_exists') return 'No se pudo completar el registro. Si ya tenés cuenta, iniciá sesión o recuperá tu contraseña.'
  if (code === 'weak_password' || code === 'same_password') return 'Elegí una contraseña distinta, de al menos 8 caracteres.'
  if (code === 'over_email_send_rate_limit' || error?.status === 429) return 'Se enviaron demasiadas solicitudes. Esperá unos minutos e intentá de nuevo.'
  if (code === 'otp_expired' || code === 'flow_state_expired') return 'El enlace venció. Pedí uno nuevo.'
  if (code === 'email_address_not_authorized') return 'El servicio de correo todavía no permite enviar a esta dirección. Revisá la configuración SMTP de Supabase.'
  if (error?.name === 'AuthRetryableFetchError' || error instanceof TypeError) return 'No pudimos conectar con el servicio. Revisá tu conexión y la configuración de Supabase.'
  return 'No pudimos completar la operación. Intentá nuevamente.'
}
