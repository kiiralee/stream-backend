/**
 * Нормализует Redis URL для `node-redis` (`createClient({ url })`).
 * При useAcl = false убираем username из URI (совместимость с Redis ≤5 и `--requirepass`).
 */
export function redisUrlForNodeRedis(uri: string, useAcl: boolean): string {
  const u = new URL(uri);
  if (!useAcl && u.username !== '') {
    u.username = '';
  }
  return u.toString();
}
