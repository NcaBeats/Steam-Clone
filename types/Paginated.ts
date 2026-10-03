/**
 * Sobre de paginacion que devuelve Spring Boot al serializar `Page<T>`
 * (PagedModel). Todos los endpoints paginados del backend la usan, asi que
 * vive aca y no junto a un recurso concreto: la consumen games, users,
 * manage/games y manage/orders.
 *
 * `fetchAPI` con `responseShape: "page"` la devuelve sin transformation; con
 * "list" devuelve solo `content`.
 */
export type Paginated<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
