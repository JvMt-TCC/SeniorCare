
-- Adicionar mais locais de cuidado em Niterói e São Gonçalo
INSERT INTO health_locations (name, type, address, city, neighborhood, latitude, longitude, phone, hours, services) VALUES
('Clínica da Família Gérson Bergher', 'Posto de Saúde', 'R. Ceres, 64 - Santa Bárbara', 'Niterói', 'Santa Bárbara', -22.8815, -43.1055, '(21) 2722-1234', '08:00 - 17:00', ARRAY['Consultas', 'Vacinação', 'Curativo', 'Medicamentos']),
('Hospital Getúlio Vargas Filho', 'Hospital', 'Av. Marquês do Paraná, 303 - Centro', 'Niterói', 'Centro', -22.8946, -43.1330, '(21) 2719-6300', '24 horas', ARRAY['Emergência', 'Internação', 'Cirurgias', 'UTI']),
('Policlínica Regional de Itaipu', 'Policlínica', 'R. Carlos Gianelli, 16 - Itaipu', 'Niterói', 'Itaipu', -22.9575, -43.0449, '(21) 2709-4500', '07:00 - 19:00', ARRAY['Consultas', 'Exames', 'Vacinação', 'Odontologia']),
('UPA de Engenhoca', 'UPA', 'R. Jorn. Rogério Coelho Neto, s/n - Engenhoca', 'Niterói', 'Engenhoca', -22.9025, -43.0798, '(21) 2625-8000', '24 horas', ARRAY['Urgência', 'Emergência', 'Raio-X', 'Medicamentos']),
('Clínica Municipal de Piratininga', 'Posto de Saúde', 'R. Dr. March, 115 - Piratininga', 'Niterói', 'Piratininga', -22.9381, -43.0573, '(21) 2709-8200', '08:00 - 17:00', ARRAY['Consultas', 'Vacinação', 'Curativo', 'Preventivo']),
('Hospital Municipal Carlos Tortelly', 'Hospital', 'Av. Pres. Roosevelt, 1020 - Centro', 'São Gonçalo', 'Centro', -22.8270, -43.0536, '(21) 2199-5400', '24 horas', ARRAY['Emergência', 'Maternidade', 'Cirurgias', 'UTI']),
('Clínica da Família Hélio Cruz', 'Posto de Saúde', 'R. Dr. Porciúncula, 75 - Trindade', 'São Gonçalo', 'Trindade', -22.8165, -43.0463, '(21) 2199-5100', '08:00 - 17:00', ARRAY['Consultas', 'Vacinação', 'Curativo', 'Medicamentos']),
('Policlínica Gonçalense do Mutondo', 'Policlínica', 'Av. Jorn. Roberto Marinho, s/n - Mutondo', 'São Gonçalo', 'Mutondo', -22.8301, -43.0451, '(21) 2199-4800', '07:00 - 19:00', ARRAY['Consultas', 'Exames', 'Vacinação', 'Odontologia']),
('UPA de Alcântara', 'UPA', 'Av. Jorn. Roberto Marinho, 881 - Alcântara', 'São Gonçalo', 'Alcântara', -22.7916, -43.0527, '(21) 2199-6200', '24 horas', ARRAY['Urgência', 'Emergência', 'Raio-X', 'Medicamentos']),
('Clínica da Família Zilda Arns', 'Posto de Saúde', 'R. Ernani Faria, 12 - Colubandê', 'São Gonçalo', 'Colubandê', -22.8243, -43.0661, '(21) 2199-5600', '08:00 - 17:00', ARRAY['Consultas', 'Vacinação', 'Curativo', 'Preventivo'])
ON CONFLICT DO NOTHING;
