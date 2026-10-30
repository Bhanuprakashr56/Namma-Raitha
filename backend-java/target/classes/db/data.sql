-- ==============================================================================
-- Initial Seed Data for Namma Raitha MySQL Database
-- Default demo accounts with BCrypt encrypted passwords ($2a$10$...)
-- Password for all accounts: "Password@123"
-- ==============================================================================

INSERT INTO users (id, username, email, password_hash, full_name, phone, role, district, state, is_verified) VALUES
(1, 'farmer_ravi', 'ravi.patil@nammaraitha.org', '$2a$10$wTqgU9bYkFzQJ7D6.81m2u9F3f6N0rF6FvA0Z6tA1E4.l5iQ7hW4y', 'Ravi Kumar Patil', '9845112345', 'ROLE_FARMER', 'Mandya', 'Karnataka', TRUE),
(2, 'buyer_anita', 'anita.sharma@gmail.com', '$2a$10$wTqgU9bYkFzQJ7D6.81m2u9F3f6N0rF6FvA0Z6tA1E4.l5iQ7hW4y', 'Anita Sharma', '9876543210', 'ROLE_BUYER', 'Bengaluru', 'Karnataka', TRUE),
(3, 'admin_namma', 'admin@nammaraitha.org', '$2a$10$wTqgU9bYkFzQJ7D6.81m2u9F3f6N0rF6FvA0Z6tA1E4.l5iQ7hW4y', 'Dr. Chethan Gowda', '9988776655', 'ROLE_ADMIN', 'Mandya', 'Karnataka', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Seed Products
INSERT INTO products (id, name, name_kn, category, price, unit, quantity, location, location_kn, farmer_name, farmer_phone, image_url, is_organic) VALUES
('prod-1', 'Farm Fresh Kolar Red Tomatoes', 'ಕೋಲಾರ ನಾಟಿ ಕೆಂಪು ಟೊಮೇಟೊ', 'vegetables', 22.00, 'kg', 1200, 'Kolar APMC, Karnataka', 'ಕೋಲಾರ', 'Manjunath Gowda', '9845112345', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', TRUE),
('prod-2', 'Fresh Red Onions', 'ಚಿತ್ರದುರ್ಗ ಕೆಂಪು ಈರುಳ್ಳಿ', 'vegetables', 28.00, 'kg', 2500, 'Chitradurga, Karnataka', 'ಚಿತ್ರದುರ್ಗ', 'Siddalingaiah', '9845223344', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80', FALSE),
('prod-3', 'Hassan Farm Fresh Potatoes', 'ಹಾಸನ ಆಲೂಗಡ್ಡೆ', 'vegetables', 24.00, 'kg', 3000, 'Hassan, Karnataka', 'ಹಾಸನ', 'Kumar Swamy', '9845334455', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', FALSE),
('prod-4', 'Organic Mandya Finger Millet / Ragi', 'ಸಾವಯವ ರಾಗಿ', 'produce', 42.00, 'kg', 1500, 'Pandavapura, Mandya', 'ಪಾಂಡವಪುರ, ಮಂಡ್ಯ', 'Shivanna K', '9845445566', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80', TRUE),
('prod-5', 'DAP (Di-Ammonium Phosphate 18:46:0) - IFFCO', 'ಡಿಎಪಿ ಗೊಬ್ಬರ', 'fertilizers', 1350.00, '50kg bag', 200, 'Mysuru Agro Centre', 'ಮೈಸೂರು', 'IFFCO Certified Agro Store', '9880011223', 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80', FALSE),
('prod-6', 'Brush Cutter 4-Stroke 50cc Engine', 'ಗ್ರಾಸ್ ಕಟರ್ & ಕಳೆ ಯಂತ್ರ', 'tools', 8900.00, 'piece', 15, 'Shivamogga Tool Depot', 'ಶಿವಮೊಗ್ಗ', 'Kisan Tool Works', '9740033445', 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=600&q=80', FALSE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Mandi Prices
INSERT INTO mandi_prices (commodity, commodity_kn, market, market_kn, district, state, category, min_price, max_price, modal_price, change_type, arrival_date) VALUES
('Tomato', 'ಟೊಮೇಟೊ', 'Kolar APMC', 'ಕೋಲಾರ', 'Kolar', 'Karnataka', 'vegetable', 1800.00, 2400.00, 2100.00, 'up', CURRENT_DATE),
('Onion', 'ಈರುಳ್ಳಿ', 'Yeshwanthpur APMC', 'ಯಶವಂತಪುರ', 'Bengaluru', 'Karnataka', 'vegetable', 2200.00, 2900.00, 2600.00, 'up', CURRENT_DATE),
('Wheat', 'ಗೋಧಿ', 'Ludhiana Mandi', 'ಲುಧಿಯಾನ', 'Ludhiana', 'Punjab', 'grain', 2250.00, 2480.00, 2350.00, 'same', CURRENT_DATE),
('Basmati Rice', 'ಬಾಸ್ಮತಿ ಅಕ್ಕಿ', 'Karnal Mandi', 'ಕರ್ನಾಲ್', 'Karnal', 'Haryana', 'grain', 3400.00, 4200.00, 3850.00, 'up', CURRENT_DATE),
('Red Chilli (Guntur G-4)', 'ಗುಂಟೂರು ಮೆಣಸಿನಕಾಯಿ', 'Guntur Chilli Yard', 'ಗುಂಟೂರು', 'Guntur', 'Andhra Pradesh', 'grain', 14500.00, 18200.00, 16800.00, 'up', CURRENT_DATE),
('Arecanut (Rashi)', 'ಅಡಿಕೆ (ರಾಶಿ)', 'Shivamogga APMC', 'ಶಿವಮೊಗ್ಗ', 'Shivamogga', 'Karnataka', 'grain', 51000.00, 56000.00, 54200.00, 'up', CURRENT_DATE)
ON DUPLICATE KEY UPDATE modal_price=VALUES(modal_price);
