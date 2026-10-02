export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, detail: string, code?: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Ejecuta la request y devuelve `null` solo cuando no hay sesion valida.
 *
 * Antes esto devolvia `null` ante cualquier fallo: un 401 (todavia no
 * logueado) y un 500 (el backend caido) terminaban en el mismo valor, asi que
 * los llamadores no tenian forma de distinguirlos. La consecuencia concreta era
 * que en el checkout un `null` de la billetera se leia igual que "no te falta
 * saldo" y el boton de comprar quedaba habilitado.
 *
 * Ahora la unica excepcion absorbida es 401/403, que es una respuesta
 * legitima para endpoints que requieren sesion. Cualquier otro fallo se
 * propaga, y el que llama decide que hacer: degradar en silencio ahi donde no
 * importa (el saldo del nav) o avisarle al usuario ahi donde si importa (el
 * checkout).
 */
export async function fetchOrNull<T>(
  request: () => Promise<T>,
): Promise<T | null> {
  try {
    return await request();
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      return null;
    }
    throw error;
  }
}
