export const calcularDeudas = (
  miembros: string[],
  gastos: { monto: number; pagadoPor: string }[]
) => {

  const total = gastos.reduce((sum, g) => sum + g.monto, 0);

  const porPersona = total / miembros.length;

  const balances: Record<string, number> = {};

  // inicializar
  miembros.forEach(m => {
    balances[m] = 0;
  });

  // sumar lo que pagó cada uno
  gastos.forEach(g => {
    balances[g.pagadoPor] += g.monto;
  });

  // restar lo que debería pagar
  miembros.forEach(m => {
    balances[m] -= porPersona;
  });

  return balances;
};