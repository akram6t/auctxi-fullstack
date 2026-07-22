USE auctxi;

-- Clear existing data if necessary (optional, but good for idempotent testing)
DELETE FROM players;
DELETE FROM teams;
DELETE FROM auctions;
DELETE FROM transactions;
DELETE FROM system_settings;

-- Reset Auto Increment
ALTER TABLE players AUTO_INCREMENT = 1;
ALTER TABLE teams AUTO_INCREMENT = 1;
ALTER TABLE auctions AUTO_INCREMENT = 1;
ALTER TABLE transactions AUTO_INCREMENT = 1;
ALTER TABLE system_settings AUTO_INCREMENT = 1;

-- Insert Mock Auctions
INSERT INTO auctions (name, date, status, total_players, budget_cap) VALUES
('IPL Mega Auction 2026', '2026-11-15 10:00:00', 'UPCOMING', 350, '100 Cr'),
('BBL Draft 2026', '2026-08-20 14:00:00', 'ACTIVE', 120, '10 Cr'),
('PSL Player Draft', '2026-10-05 11:30:00', 'COMPLETED', 200, '5 Cr');

-- Insert Mock Teams
INSERT INTO teams (name, owner_email, purse, squad_size) VALUES
('Mumbai Indians', 'owner@mi.com', '100 Cr', 25),
('Chennai Super Kings', 'owner@csk.com', '95 Cr', 24),
('Royal Challengers', 'owner@rcb.com', '100 Cr', 25),
('Delhi Capitals', 'owner@dc.com', '80 Cr', 20);

-- Insert Mock Players
INSERT INTO players (name, role, country, base_price, status, team_id) VALUES
('Virat Kohli', 'Batter', 'India', '2 Cr', 'Sold', 3),
('MS Dhoni', 'Wicketkeeper', 'India', '2 Cr', 'Sold', 2),
('Rohit Sharma', 'Batter', 'India', '2 Cr', 'Sold', 1),
('Jasprit Bumrah', 'Bowler', 'India', '2 Cr', 'Sold', 1),
('Mitchell Starc', 'Bowler', 'Australia', '2 Cr', 'Sold', 1),
('Babar Azam', 'Batter', 'Pakistan', '1 Cr', 'Available', NULL),
('Ben Stokes', 'All-Rounder', 'England', '2 Cr', 'Available', NULL),
('Rashid Khan', 'Bowler', 'Afghanistan', '2 Cr', 'Sold', 4),
('Kane Williamson', 'Batter', 'New Zealand', '1 Cr', 'Unsold', NULL),
('David Warner', 'Batter', 'Australia', '1.5 Cr', 'Available', NULL);

-- Insert Mock Transactions
INSERT INTO transactions (date, amount, type, status, reference) VALUES
('2026-07-20 09:15:00', 5000000, 'CREDIT', 'COMPLETED', 'TRX-998822'),
('2026-07-21 14:30:00', 1200000, 'DEBIT', 'COMPLETED', 'TRX-129933'),
('2026-07-22 10:00:00', 250000, 'CREDIT', 'PENDING', 'TRX-776655');

-- Insert Mock System Settings
INSERT INTO system_settings (setting_key, setting_value) VALUES
('enable_notifications', 'true'),
('auction_timer_duration', '30'),
('max_purse_limit', '100000000'),
('currency_symbol', '₹');
