INSERT INTO users (name, email, password) VALUES
('Jack Lou', 'jlou@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Mary Smith', 'smithmary@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Lucy Waters', 'lucywaters@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) VALUES
(2, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 930.61, 6, 4, 8, 'Canada', 'Namsub Highway', 'Sotboske', 'Quebec', 28142, true),
(1, 'Blank corner', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 110, 6, 6, 7, 'Canada', 'Nami Road', 'Bohbatev', 'Alberta', 83680, true),
(3, 'Habit mix', 'description', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 55, 0, 5, 6, 'Canada',  'Hejto Center', 'Genwezuj', 'Newfoundland And Labrador', 44583, true);

INSERT INTO reservations (guest_id, property_id, start_date, end_date) VALUES
(2, 1, '2019-01-04', '2019-02-01'),
(3, 2, '2023-10-01', '2023-10-14'),
(1, 3, '2018-09-11', '2018-09-26');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES
(1, 2, 3, 3, 'message'),
(2, 3, 1, 5, 'message'),
(3, 1, 2, 5, 'message');
