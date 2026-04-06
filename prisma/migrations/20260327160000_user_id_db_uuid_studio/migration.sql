-- UUID на стороне БД (Prisma Studio часто передаёт id как пустую строку — DEFAULT на колонке тогда не срабатывает).
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

CREATE OR REPLACE FUNCTION users_set_id_if_empty()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id := gen_random_uuid()::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_id_if_empty ON "users";
CREATE TRIGGER users_set_id_if_empty
  BEFORE INSERT ON "users"
  FOR EACH ROW
  EXECUTE PROCEDURE users_set_id_if_empty();
