/**
 * One fun fact a day, shown at the top of every page.
 * The list repeats from the start when it runs out. Add, change or remove lines freely:
 * the fact is chosen by the date, so the order below is the order of the days.
 */
export const FUN_FACTS: string[] = [
  'The word \u201Cmortgage\u201D comes from Old French for \u201Cdead pledge\u201D: the pledge ends, or \u201Cdies,\u201D when the loan is paid off.',
  'The Empire State Building went up in just 410 days and opened in 1931.',
  'Central Park covers 843 acres in the middle of Manhattan.',
  'Tribeca takes its name from \u201CTriangle Below Canal Street.\u201D',
  'DUMBO stands for \u201CDown Under the Manhattan Bridge Overpass.\u201D',
  'SoHo means \u201CSouth of Houston Street,\u201D and Houston is pronounced \u201CHOW-ston.\u201D',
  'NoMad is short for \u201CNorth of Madison Square Park.\u201D',
  'The word \u201Cstoop\u201D comes from the Dutch \u201Cstoep,\u201D a legacy of New York\u2019s Dutch beginnings.',
  'A \u201Crailroad apartment\u201D has its rooms in a straight line, like cars on a train.',
  '\u201CPied-\u00E0-terre\u201D is French for \u201Cfoot on the ground,\u201D a small home kept in the city.',
  'The \u201Cpenthouse\u201D began as a small structure attached to a roof. The word comes from an old French word for \u201Cappendage.\u201D',
  '\u201CEscrow\u201D comes from an Old French word for a scroll: a document held safely by a third party until a deal is complete.',
  'In a co-op you own shares in a corporation and a proprietary lease, rather than the apartment itself. In a condo you own the apartment.',
  'Manhattan\u2019s street grid comes from the Commissioners\u2019 Plan of 1811, which mapped 12 numbered avenues and 155 cross streets.',
  'Walking north or south in Manhattan, about 20 blocks make a mile.',
  'The Flatiron Building was first called the Fuller Building. New Yorkers renamed it for its shape, like a clothes iron.',
  'The Chrysler Building was the world\u2019s tallest building for less than a year, from 1930 to 1931.',
  'The Brooklyn Bridge opened in 1883 and was the longest suspension bridge in the world at the time.',
  'Brooklyn was its own city until 1898, when it joined New York.',
  'The SoHo Cast-Iron Historic District is often said to hold the largest collection of cast-iron architecture in the world.',
  'Brooklyn Heights became the city\u2019s first historic district in 1965.',
  'New York\u2019s Landmarks Law passed in 1965, partly in response to the loss of the original Penn Station.',
  'Grand Central Terminal was saved from demolition, and a 1978 Supreme Court decision upheld New York\u2019s landmark protections.',
  'New York adopted the nation\u2019s first citywide zoning rules in 1916, after the Equitable Building cast a huge shadow over its neighbors.',
  'The stepped \u201Cwedding cake\u201D shape of many older towers comes from the 1916 zoning rules, which required setbacks to let light reach the street.',
  'Air rights let an owner sell unused building space to a neighbor. Grand Central\u2019s air rights have been sold to nearby towers.',
  'Brownstone is a brown sandstone. Much of the stone used in New York came from quarries in Connecticut and New Jersey.',
  'Prospect Park, in Brooklyn, was designed by Frederick Law Olmsted and Calvert Vaux, the same pair behind Central Park.',
  'Prospect Park covers 526 acres.',
  'Gramercy Park, laid out in 1831, is still opened only with a key carried by residents of the surrounding buildings.',
  'Harlem takes its name from Haarlem, a Dutch city. The settlement was named Nieuw Haarlem in 1658.',
  'Wall Street is named for the wall the Dutch built across lower Manhattan in the 1600s.',
  'Battery Park City was built on landfill, including earth dug up while building the original World Trade Center.',
  'The USS Monitor, the Civil War ironclad, was built in Greenpoint, Brooklyn.',
  'Kaufman Astoria Studios in Queens opened in 1920 and is still a working film studio.',
  'The Pepsi-Cola sign on the Long Island City waterfront has been part of the skyline since 1936.',
  'The West Village\u2019s tangled streets predate Manhattan\u2019s 1811 grid, which is why they do not line up neatly.',
  'The Liz Christy Garden, opened in 1973 on the Lower East Side, is often called the city\u2019s first community garden.',
  'The Tenement Museum on Orchard Street occupies a building that dates to 1863.',
  'The elevator made tall living practical. Elisha Otis showed his safety elevator at New York\u2019s Crystal Palace in 1854.',
  'The first modern skyscraper is often said to be Chicago\u2019s ten-story Home Insurance Building, finished in 1885.',
  'The Woolworth Building, finished in 1913, was the tallest in the world until 1930, and Frank Woolworth reportedly paid for it in cash.',
  'Manhattan covers only about 23 square miles of land.',
  'An acre is 43,560 square feet, a little smaller than an American football field.',
  'New York\u2019s rent stabilization system began in 1969.',
  '\u201CReal property\u201D means property that cannot be moved: land and whatever is permanently attached to it.',
  'A \u201Cfloor-through\u201D apartment takes up an entire floor, with windows at both the front and the back of the building.',
  '\u201CPrewar\u201D in New York usually means a building constructed before World War II, often loved for high ceilings and thick walls.',
  'The first artists\u2019 lofts appeared in SoHo in the 1960s, in old factories and warehouses that had been left empty.',
  'The High Line is an old elevated freight railway, about a mile and a half long, turned into a park that opened in 2009.',
  'Brooklyn Heights\u2019 Promenade was built over a highway, the Brooklyn-Queens Expressway, which opened in the 1950s.',
  'The Dakota opened in 1884. The story goes that it was named for being so far uptown that it felt as remote as the Dakota Territory.',
  'The Washington Square Arch was first built of wood for a celebration in 1889, then replaced with marble in 1892.',
  'Hudson Yards is often called the largest private real estate development in the history of the United States.',
  'Carroll Gardens has unusually deep front gardens, a quirk of the way its blocks were laid out in the 1840s.',
  'Fifth Avenue\u2019s Museum Mile, along the Upper East Side, is home to nine museums.',
  'Chelsea was named for an 18th-century estate called Chelsea, after the neighborhood in London.',
  'Thousands of wooden water towers still sit on New York rooftops. Buildings over six stories need them for water pressure.',
  'The first co-op apartment building in New York is often said to be the Rembrandt, built on West 57th Street in 1881.',
  'In New York, buying a co-op often includes an interview with the building\u2019s board.',
]

/** Picks today\u2019s fact by the date in New York, so everyone sees the same one all day. */
export function factOfTheDay(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const dayNumber = Math.floor(Date.UTC(get('year'), get('month') - 1, get('day')) / 86_400_000)
  return FUN_FACTS[dayNumber % FUN_FACTS.length]
}
