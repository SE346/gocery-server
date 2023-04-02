CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$;