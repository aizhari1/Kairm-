-- Karam: neon palette. Overrides brand colors saved in Global Settings (runtime CSS variables).
update public.site_settings
set value = '{"background":"#05060D","surface":"#0A0C18","card":"#0F1226","purple":"#00F0FF","purple_light":"#FF2BD6","muted":"#9FB4C7"}'
where key = 'brand.colors';
