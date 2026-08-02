-- Seed data for Next Place Living Cloudflare D1 Database

-- Insert Country: Poland
INSERT INTO countries (id, name, slug, description, image, visa_guideline, residency_guideline, tax_policy, currency, exchange_rate_to_eur, language, climate_overview)
VALUES (
    'poland',
    'Poland',
    'poland',
    'Boasting rich historical heritage, a booming economy, safe modern cities, and a very low cost of living, Poland is increasingly popular for expats and digital nomads.',
    'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=80',
    'EU citizens register residency after 3 months. Non-EU citizens can acquire temporary residence cards (Karta Pobytu) through employment, business setup, or studying.',
    'Permanent residency is obtainable after 5 continuous years of temporary residency. Polish citizenship is available after 3 years as a permanent resident.',
    'Progressive tax brackets of 12% and 32%. A linear tax rate of 19% is available for sole traders (B2B contracts). IP Box tax rate of 5% applies to software developers.',
    'PLN',
    0.23,
    'Polish',
    'Temperate climate with four distinct seasons. Warm summers (averaging 25°C) and snowy winters (often dropping below 0°C).'
) ON CONFLICT(id) DO UPDATE SET name=excluded.name;

-- Insert Country: Spain
INSERT INTO countries (id, name, slug, description, image, visa_guideline, residency_guideline, tax_policy, currency, exchange_rate_to_eur, language, climate_overview)
VALUES (
    'spain',
    'Spain',
    'spain',
    'Renowned for its golden beaches, vibrant culture, and relaxed Mediterranean lifestyle, Spain is one of the world’s top destinations for retirees and expats.',
    'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80',
    'EU Citizens NIE registration. Golden Visa via €500 000 investment. Non-Lucrative Visa with €28 000 passive income.',
    'After 5 years of legal temporary residence, expats can obtain permanent residency. Citizenship is normal after 10 years.',
    'Beckham Law flat 24% tax rate up to €600 000 for 5 years.',
    'EUR',
    1.0,
    'Spanish',
    'Mediterranean climate with over 300 sunny days annually.'
) ON CONFLICT(id) DO UPDATE SET name=excluded.name;

-- Insert Cities: Warsaw, Kraków, Gdańsk, Wrocław, Valencia, Málaga
INSERT INTO cities (id, name, slug, country_id, description, image, latitude, longitude, safety, healthcare, climate, walkability, transit, greenery, tax_score, cost_index, retirement_score, expat_index)
VALUES 
(
    'warsaw',
    'Warsaw',
    'warsaw',
    'poland',
    'Warsaw is a modern, bustling metropolis that rose from the ashes of WWII. Combining a glittering skyscraper skyline with massive parklands, a safe environment, and lightning-fast fiber internet, it is a key hub for companies and digital nomads.',
    'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=80',
    52.2297, 21.0122,
    92, 76, 62, 82, 92, 85, 70, 36, 78, 85
),
(
    'krakow',
    'Kraków',
    'krakow',
    'poland',
    'Kraków is the historical jewel of Poland. Escaping significant war destruction, its medieval Old Town and Jewish Quarter (Kazimierz) are filled with architectural beauty, cobblestone streets, and a huge tourist/expat community.',
    'https://images.unsplash.com/photo-1589625900595-c80f0814a7e9?auto=format&fit=crop&w=800&q=80',
    50.0647, 19.9450,
    88, 74, 60, 90, 85, 78, 70, 34, 79, 88
),
(
    'gdansk',
    'Gdańsk',
    'gdansk',
    'poland',
    'A beautiful city on the Baltic coast, known for its historic port, shipyard history, maritime charm, and sandy beaches. Offers a very relaxed quality of life.',
    'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
    54.3520, 18.6466,
    90, 75, 64, 84, 88, 82, 70, 33, 82, 86
),
(
    'wroclaw',
    'Wrocław',
    'wroclaw',
    'poland',
    'Known as the city of 100 bridges and famous dwarfs, Wrocław offers a beautiful market square, cozy islands, and a vibrant tech expat community.',
    'https://images.unsplash.com/photo-1598449356475-b9f71ef7d847?auto=format&fit=crop&w=800&q=80',
    51.1079, 17.0385,
    89, 74, 63, 86, 87, 80, 70, 32, 80, 85
),
(
    'valencia',
    'Valencia',
    'valencia',
    'spain',
    'Valencia offers the perfect balance of metropolitan life and coastal relaxation. Blessed with flat, highly bikeable terrain and dry riverbed park.',
    'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
    39.4699, -0.3763,
    82, 88, 92, 85, 78, 80, 65, 38, 89, 94
) ON CONFLICT(id) DO UPDATE SET name=excluded.name;

-- Insert Neighborhoods
INSERT INTO neighborhoods (id, city_id, name, description, safety_index, walkability_index, noise_level, cost_rating, green_spaces_index, ev_charging, lifestyle_profile, latitude, longitude, healthcare_index, dining_index, shopping_index, retirement_index)
VALUES
-- Warsaw
(
    'mokotow', 'warsaw', 'Mokotów',
    'A sprawling green residential neighborhood just south of the city center. Features historic villas, pre-war buildings, beautiful parks (Morskie Oko), and a robust layout of bike lanes. Safe and quiet.',
    94, 86, 'Quiet', '$$', 88, 'High', 'Families, Quiet, Greenery', 52.1930, 21.0240, 88, 80, 82, 85
),
(
    'srodmiescie-warsaw', 'warsaw', 'Śródmieście',
    'The core city center. Blends high-rise offices, modern restaurants, luxury apartments, and the reconstructed historic Old Town. Excellent transit links.',
    88, 96, 'Lively', '$$$', 70, 'High', 'Business, Nightlife, Foodies', 52.2300, 21.0100, 85, 95, 92, 72
),
(
    'wilanow', 'warsaw', 'Wilanów',
    'Known for its Baroque Royal Palace, Wilanów is a modern, upscale family residential area. Highly safe, bike-friendly, with superb international schools.',
    97, 78, 'Quiet', '$$$', 90, 'High', 'Families, Luxury, Quiet', 52.1640, 21.0850, 84, 75, 80, 92
),
-- Kraków
(
    'stare-miasto-krakow', 'krakow', 'Stare Miasto',
    'The historic old town inside the green planty ring-park. Completely pedestrianized, beautiful medieval market square, but heavily touristy and noisy.',
    85, 99, 'Lively', '$$$', 80, 'Low', 'History, Culture, Nightlife', 50.0614, 19.9383, 82, 94, 90, 76
),
(
    'kazimierz', 'krakow', 'Kazimierz',
    'The Jewish Quarter, now the bohemian cultural heart of Kraków. Filled with art galleries, cozy bars, kosher restaurants, and street food. Highly artistic.',
    84, 96, 'Lively', '$$', 65, 'Low', 'Artistic, Nightlife, Foodies', 50.0520, 19.9440, 78, 96, 85, 70
),
-- Valencia
(
    'ruzafa', 'valencia', 'Ruzafa',
    'Valencia’s trendy hipster district, filled with specialty coffee shops, organic bakeries, boutique shops, and a lively food market.',
    78, 94, 'Lively', '$$$', 65, 'Medium', 'Creative, Nightlife, Foodies', 39.4610, -0.3735, 85, 95, 90, 75
) ON CONFLICT(id) DO UPDATE SET name=excluded.name;

-- Insert Properties
INSERT INTO properties (id, title, description, price, currency, size, bedrooms, bathrooms, type, city_slug, neighborhood, image, images, amenities, latitude, longitude, epc_rating, parking, ev_ready, commute_time_train, noise_rating, exact_address, floor, has_elevator, is_agency, agency_name, agency_logo, agency_website, agency_contact, featured, listed_date, days_on_market, est_market_value_per_sqm, provider, price_history, commute_times, ev_charging_stations)
VALUES
-- Warsaw
(
    'prop-pl-war-01',
    'Elegant Apartment by Morskie Oko Park',
    'Situated in the premium residential quarter of Mokotów, this luxury apartment overlooks the historic Morskie Oko park. Blends Scandinavian oak floorboards with bespoke Italian kitchen appliances. Includes dedicated basement storage and a secure underground parking space.',
    2450000, 'PLN', 92, 2, 2, 'Apartment', 'warsaw', 'Mokotów',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"]',
    '["Park View","Balcony","Garage","Security","Quiet Area","Dishwasher"]',
    52.1945, 21.0260, 'B', 1, 0, 8, 'Low',
    'ul. Parkowa 12, 00-759 Warszawa, Poland', 3, 1, 1, 'Hamilton May Warsaw',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80',
    'https://www.hamiltonmay.com', '+48 22 456 78 90', 0, '2026-05-15', 30, 26500, 'Otodom Partner',
    '[{"date":"2026-05-15","price":2450000,"event":"Listed"}]',
    '{"center":{"car":12,"transit":8,"walk":40},"airport":{"car":18,"transit":30},"hospital":{"car":6,"walk":12},"mall":{"car":10,"transit":14}}',
    '[{"name":"GreenWay Charging Point","powerKw":50,"operator":"GreenWay","distanceM":350,"connector":"CCS2"}]'
),
(
    'prop-pl-war-02',
    'Skyscraper Penthouse in Śródmieście',
    'Perched on the 32nd floor of a prestigious residential tower, this luxury penthouse offers panoramic views over Warsaw’s skyscraper skyline. Featuring smart climate control, triple-glazed windows, a concierge service, access to a private resident gym, and secure parking.',
    4800000, 'PLN', 160, 3, 3, 'Penthouse', 'warsaw', 'Śródmieście',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=600&q=80',
    '["https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80"]',
    '["City View","Concierge","Resident Gym","Air Conditioning","Garage","Smart Home"]',
    52.2315, 21.0090, 'A', 1, 1, 2, 'Medium',
    'ul. Twarda 4, 00-105 Warszawa, Poland', 32, 1, 1, 'Sotheby’s International Realty Poland',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
    'https://www.polandsothebysrealty.com', '+48 22 999 00 11', 1, '2026-05-01', 44, 30000, 'Sotheby’s API',
    '[{"date":"2026-05-01","price":4950000,"event":"Listed"},{"date":"2026-05-25","price":4800000,"event":"Price drop"}]',
    '{"center":{"car":2,"transit":2,"walk":5},"airport":{"car":15,"transit":22},"hospital":{"car":4,"walk":8},"mall":{"car":3,"walk":5}}',
    '[{"name":"Złote Tarasy Underground Fast Charger","powerKw":150,"operator":"GreenWay","distanceM":150,"connector":"CCS2"}]'
),
-- Valencia
(
    'prop-es-val-01',
    'Historic Penthouse in Ruzafa',
    'A beautifully renovated duplex penthouse featuring exposed wooden beams, brick walls, and a spectacular 30m² private terrace. Positioned in the center of Ruzafa, just steps away from local organic cafes and the neighborhood market.',
    495000, 'EUR', 110, 2, 2, 'Penthouse', 'valencia', 'Ruzafa',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"]',
    '["Terrace","Air Conditioning","Elevator","Double Glazing","Dishwasher"]',
    39.4605, -0.3725, 'B', 0, 0, 10, 'Medium',
    'Calle de Sueca 32, 46006 Valencia, Spain', 4, 1, 1, 'Valencia Prime Estates',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
    'https://valenciaprimeestates.com', '+34 960 123 456', 1, '2026-04-12', 63, 4550, 'Idealista API',
    '[{"date":"2026-04-12","price":520000,"event":"Listed"},{"date":"2026-05-15","price":495000,"event":"Price drop"}]',
    '{"center":{"car":8,"transit":10,"walk":15},"airport":{"car":18,"transit":28},"hospital":{"car":10,"walk":18},"mall":{"car":12,"transit":20}}',
    '[{"name":"Endesa X Ruzafa Hub","powerKw":50,"operator":"Endesa X","distanceM":280,"connector":"CCS2"}]'
) ON CONFLICT(id) DO UPDATE SET title=excluded.title;
