-- Storage Policies for 'psh_catalouges' bucket

-- Everyone can view
create policy "Public can view images" on storage.objects for select using (bucket_id = 'psh_catalouges');

-- Only authenticated users can upload
create policy "Authenticated can upload images" on storage.objects for insert with check (bucket_id = 'psh_catalouges' and auth.role() = 'authenticated');

-- Only authenticated users can delete
create policy "Authenticated can delete images" on storage.objects for delete using (bucket_id = 'psh_catalouges' and auth.role() = 'authenticated');
