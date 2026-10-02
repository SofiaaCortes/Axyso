import { describe, it, expect } from 'vitest'
import { cn } from './utils'

// Pruebas unitarias para la utilidad cn() que combina clases de Tailwind.
// cn() usa clsx (condicionales) + tailwind-merge (resuelve conflictos).
describe('cn()', () => {
  it('une varias clases en una sola cadena', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('ignora valores falsy (condicionales)', () => {
    const activo = false
    expect(cn('text-sm', activo && 'font-bold', 'text-gray-500')).toBe('text-sm text-gray-500')
  })

  it('resuelve clases de Tailwind en conflicto quedándose con la última', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('acepta arreglos de clases', () => {
    expect(cn(['flex', 'items-center'], 'gap-2')).toBe('flex items-center gap-2')
  })
})
