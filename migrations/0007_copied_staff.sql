-- Retain copied accounts for recovery while removing their access to this new school.
UPDATE staff SET active=0 WHERE email LIKE '%@ashinaga.%';
-- The earlier public prototype used a shared initial password; disable those initial accounts.
UPDATE staff SET active=0 WHERE username IN ('admin','mwesigwa') AND password_salt='10fb29ddff6c2007ac5dc7050a93e1845eb41b0d2139ee98';
