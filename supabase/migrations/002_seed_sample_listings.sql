-- BetsLedger seed data
-- A representative slice across verticals so the review, compare, and
-- "best X for Y" page templates have real data to render. Descriptions
-- and attribute values are placeholders -- replace with researched
-- copy before publishing.

-- ---------------------------------------------------------------------
-- Crypto Casinos
-- ---------------------------------------------------------------------
with new_listings as (
  insert into listings (name, slug, vertical, short_description, rating, founded_year)
  values
    ('Stake', 'stake', 'crypto-casinos', 'Large crypto-native casino with slots, live dealer, and originals games.', 4.6, 2017),
    ('BC.Game', 'bc-game', 'crypto-casinos', 'Crypto casino with a wide game library and a loyalty rewards system.', 4.4, 2017),
    ('Roobet', 'roobet', 'crypto-casinos', 'Crypto casino known for its original crash and Plinko-style games.', 4.2, 2019)
  returning id, slug
)
insert into listing_attributes (listing_id, key, value, label, display_order)
select id, attr.key, attr.value, attr.label, attr.display_order
from new_listings
cross join lateral (
  values
    ('supported_cryptocurrencies', 'BTC, ETH, USDT, LTC, DOGE', 'Supported Cryptocurrencies', 1),
    ('license_jurisdiction', 'Curaçao', 'License', 2),
    ('game_count', '3000', 'Number of Games', 3),
    ('withdrawal_speed_minutes', '30', 'Avg. Withdrawal Time (min)', 4),
    ('welcome_bonus', 'Up to 200% deposit match', 'Welcome Bonus', 5),
    ('provably_fair', 'true', 'Provably Fair Games', 6),
    ('ease_of_use_score', '8.5', 'Ease of Use Score', 7),
    ('security_score', '8.0', 'Security Score', 8)
) as attr(key, value, label, display_order);

-- ---------------------------------------------------------------------
-- Sweepstakes & Social Casinos
-- ---------------------------------------------------------------------
with new_listings as (
  insert into listings (name, slug, vertical, short_description, rating, founded_year)
  values
    ('Stake.us', 'stake-us', 'sweepstakes-casinos', 'Sweepstakes casino using a Gold Coin / Stake Cash dual-currency model.', 4.3, 2023),
    ('Chumba Casino', 'chumba-casino', 'sweepstakes-casinos', 'Long-running social casino with Sweeps Coins redeemable for cash prizes.', 4.1, 2012)
  returning id, slug
)
insert into listing_attributes (listing_id, key, value, label, display_order)
select id, attr.key, attr.value, attr.label, attr.display_order
from new_listings
cross join lateral (
  values
    ('dual_currency_model', 'Gold Coins / Sweeps Coins', 'Currency Model', 1),
    ('no_purchase_amoe_available', 'true', 'Free Entry Method (AMOE) Available', 2),
    ('state_restrictions', 'CA, CT, ID, IN, LA, MI, MT, NV, NJ, NY, TN, WA', 'Restricted States', 3),
    ('sweeps_redemption_minimum', '$50', 'Minimum Redemption', 4),
    ('kyc_required', 'true', 'KYC Required for Redemption', 5),
    ('ease_of_use_score', '8.0', 'Ease of Use Score', 6)
) as attr(key, value, label, display_order);

-- ---------------------------------------------------------------------
-- Crypto Sportsbooks
-- ---------------------------------------------------------------------
with new_listings as (
  insert into listings (name, slug, vertical, short_description, rating, founded_year)
  values
    ('Stake Sportsbook', 'stake-sportsbook', 'crypto-sportsbooks', 'Sportsbook arm of Stake with crypto deposits and live betting.', 4.5, 2017),
    ('BC.Game Sportsbook', 'bc-game-sportsbook', 'crypto-sportsbooks', 'Sportsbook integrated into the BC.Game platform.', 4.2, 2017)
  returning id, slug
)
insert into listing_attributes (listing_id, key, value, label, display_order)
select id, attr.key, attr.value, attr.label, attr.display_order
from new_listings
cross join lateral (
  values
    ('sports_covered', 'Football, Basketball, Soccer, Esports, Tennis', 'Sports Covered', 1),
    ('live_betting', 'true', 'Live Betting', 2),
    ('parlay_support', 'true', 'Parlay Support', 3),
    ('supported_cryptocurrencies', 'BTC, ETH, USDT, LTC', 'Supported Cryptocurrencies', 4),
    ('ease_of_use_score', '8.2', 'Ease of Use Score', 5)
) as attr(key, value, label, display_order);

-- ---------------------------------------------------------------------
-- VPNs for Crypto Gambling Access
-- ---------------------------------------------------------------------
with new_listings as (
  insert into listings (name, slug, vertical, short_description, rating, founded_year)
  values
    ('NordVPN', 'nordvpn', 'vpns', 'Widely used VPN with a large server network and no-logs policy.', 4.6, 2012),
    ('ExpressVPN', 'expressvpn', 'vpns', 'Premium VPN known for speed and broad device support.', 4.5, 2009),
    ('Surfshark', 'surfshark', 'vpns', 'Budget-friendly VPN with unlimited simultaneous connections.', 4.3, 2018)
  returning id, slug
)
insert into listing_attributes (listing_id, key, value, label, display_order)
select id, attr.key, attr.value, attr.label, attr.display_order
from new_listings
cross join lateral (
  values
    ('server_count', '5000', 'Server Count', 1),
    ('no_logs_policy', 'true', 'No-Logs Policy', 2),
    ('crypto_payment_accepted', 'true', 'Accepts Crypto Payment', 3),
    ('speed_rating', '9.0', 'Speed Rating', 4),
    ('price_monthly', '3.99', 'Monthly Price (USD)', 5)
) as attr(key, value, label, display_order);

-- ---------------------------------------------------------------------
-- Flagship: Crypto Gambling Affiliate Programs
-- ---------------------------------------------------------------------
with new_listings as (
  insert into listings (name, slug, vertical, short_description, rating)
  values
    ('Stake Affiliate Program', 'stake-affiliate-program', 'affiliate-programs', 'Revenue-share affiliate program for Stake casino and sportsbook.', 4.5),
    ('BC.Game Affiliate Program', 'bc-game-affiliate-program', 'affiliate-programs', 'Affiliate program covering BC.Game casino and sportsbook traffic.', 4.3),
    ('NordVPN Affiliate Program', 'nordvpn-affiliate-program', 'affiliate-programs', 'High-payout affiliate program for NordVPN subscriptions.', 4.6)
  returning id, slug
)
insert into listing_attributes (listing_id, key, value, label, display_order)
select id, attr.key, attr.value, attr.label, attr.display_order
from new_listings
cross join lateral (
  values
    ('commission_type', 'Revenue Share', 'Commission Type', 1),
    ('commission_rate', 'Up to 40%', 'Commission Rate', 2),
    ('cookie_duration', '30 days', 'Cookie Duration', 3),
    ('payment_methods', 'Crypto, Bank Transfer', 'Payment Methods', 4),
    ('minimum_payout', '$50', 'Minimum Payout', 5)
) as attr(key, value, label, display_order);

-- ---------------------------------------------------------------------
-- Comparison pairs
-- ---------------------------------------------------------------------
insert into comparison_pairs (slug_a, slug_b, vertical, is_active)
values
  ('stake', 'bc-game', 'crypto-casinos', true),
  ('nordvpn', 'expressvpn', 'vpns', true),
  ('stake-us', 'chumba-casino', 'sweepstakes-casinos', true)
on conflict (slug_a, slug_b) do nothing;
