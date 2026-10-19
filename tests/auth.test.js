import { test } from 'node:test'
import assert from 'node:assert/strict'
import { safeReturnPath, authError } from '../src/lib/authUtils.js'

test('conserva rutas internas y búsquedas al volver del login', () => {
  assert.equal(safeReturnPath('/buscar?q=Daft+Punk'), '/buscar?q=Daft+Punk')
  assert.equal(safeReturnPath('/favoritos'), '/favoritos')
})
test('rechaza destinos externos, ambiguos y ciclos de autenticación', () => {
  for (const value of ['https://evil.test', '//evil.test', '/\\evil.test', '/login', '/registro?next=/login', '/auth/callback', null, 123]) {
    assert.equal(safeReturnPath(value), '/perfil')
  }
})
test('los errores de credenciales, confirmación y límites tienen mensajes distintos', () => {
  assert.match(authError({ code: 'invalid_credentials' }), /correo o la contraseña/)
  assert.match(authError({ code: 'email_not_confirmed' }), /Confirmá/)
  assert.match(authError({ status: 429 }), /Esperá/)
  assert.match(authError({ code: 'unknown', message: 'sensitive internal detail' }), /No pudimos/)
  assert.doesNotMatch(authError({ message: 'sensitive internal detail' }), /sensitive/)
})
