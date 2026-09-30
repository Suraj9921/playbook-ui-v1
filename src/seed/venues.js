export const SPORTS = {
  football: { label: 'Football', gradient: 'from-emerald-500 to-lime-400' },
  badminton: { label: 'Badminton', gradient: 'from-sky-500 to-cyan-300' },
  cricket: { label: 'Cricket Nets', gradient: 'from-amber-500 to-yellow-300' },
  tennis: { label: 'Tennis', gradient: 'from-fuchsia-500 to-pink-300' },
  pickleball: { label: 'Pickleball', gradient: 'from-violet-500 to-indigo-300' },
}

export const AMENITIES = ['Parking', 'Floodlights', 'Showers', 'Drinking water', 'Cafe', 'Changing room', 'Equipment rental']

export const CITIES = ['Bengaluru', 'Kochi', 'Chennai', 'Hyderabad']

export const BLANK_VENUE = {
  name: '',
  sport: 'football',
  city: CITIES[0],
  area: '',
  pricePerHour: 1000,
  openFrom: 6,
  openTo: 22,
  amenities: ['Parking'],
  description: '',
}

const v = (id, name, sport, city, area, pricePerHour, openFrom, openTo, amenities, ownerId, description, status = 'approved') => ({
  id, name, sport, city, area, pricePerHour, openFrom, openTo, amenities, ownerId, description, status, blocked: [],
})

export const seedVenues = [
  v('v1', 'Greenline Arena', 'football', 'Bengaluru', 'Koramangala', 1800, 6, 23, ['Parking', 'Floodlights', 'Showers', 'Drinking water'], 'u-owner1', '5-a-side turf with rooftop views and night lighting.'),
  v('v2', 'Shuttle Street', 'badminton', 'Bengaluru', 'Indiranagar', 450, 5, 22, ['Parking', 'Changing room', 'Equipment rental'], 'u-owner1', 'Four wooden-floor courts with anti-glare lighting.'),
  v('v3', 'Boundary Box', 'cricket', 'Bengaluru', 'HSR Layout', 900, 6, 22, ['Floodlights', 'Equipment rental', 'Drinking water'], 'u-owner1', 'Bowling-machine lanes and turf nets for serious practice.'),
  v('v4', 'Baseline Club', 'tennis', 'Bengaluru', 'Whitefield', 700, 6, 21, ['Parking', 'Showers', 'Cafe'], 'u-owner1', 'Two synthetic hard courts, coaching on weekends.'),
  v('v5', 'Dink District', 'pickleball', 'Bengaluru', 'Jayanagar', 600, 7, 22, ['Cafe', 'Equipment rental'], 'u-owner1', 'The friendliest pickleball hub in town. Paddles provided.'),
  v('v6', 'Backwater Kickoff', 'football', 'Kochi', 'Kakkanad', 1400, 6, 23, ['Parking', 'Floodlights', 'Changing room'], 'u-owner2', '7-a-side turf a short drive from Infopark.'),
  v('v7', 'Smash Point', 'badminton', 'Kochi', 'Edappally', 400, 5, 22, ['Parking', 'Drinking water'], 'u-owner2', 'Three courts, pro-grade mats, AC lounge.'),
  v('v8', 'Marina Nets', 'cricket', 'Chennai', 'Adyar', 800, 6, 21, ['Floodlights', 'Showers'], 'u-owner2', 'Sea-breeze nets with turf and cement pitches.'),
  v('v9', 'Charminar Turf', 'football', 'Hyderabad', 'Gachibowli', 1600, 6, 24, ['Parking', 'Floodlights', 'Cafe', 'Showers'], 'u-owner2', 'Open till midnight. Big-screen match nights on Fridays.'),
  v('v10', 'Rally House', 'tennis', 'Chennai', 'Anna Nagar', 650, 6, 20, ['Parking', 'Changing room'], 'u-owner2', 'Clay-feel court and ball machine hire.'),
  v('v11', 'Pickle Parade', 'pickleball', 'Hyderabad', 'Madhapur', 550, 7, 22, ['Cafe', 'Drinking water'], 'u-owner2', 'Four outdoor courts under shade sails.'),
  v('v12', 'Night Owl Futsal', 'football', 'Bengaluru', 'Hebbal', 1500, 16, 24, ['Floodlights', 'Parking'], 'u-owner1', 'Evening-only futsal cage, perfect after work.', 'pending'),
]
