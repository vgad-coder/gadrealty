import { NEIGHBORHOOD_TEXT } from './neighborhood-text'
import { slugify } from './slug'

/**
 * Fun facts about each neighborhood, shown on the Neighborhoods page.
 * The key is the neighborhood's name exactly as it is written in neighborhood-text.ts.
 * Add, change or remove lines freely. Each neighborhood shows one fact a day, and
 * moves on to its next fact when the list for that day comes round again.
 */
export const NEIGHBORHOOD_FACTS: Record<string, string[]> = {
  Tribeca: [
    'The name is short for \u201CTriangle Below Canal Street.\u201D',
    'The Tribeca Film Festival began in 2002, founded by Robert De Niro, Jane Rosenthal and Craig Hatkoff to help revive lower Manhattan after September 11.',
  ],
  'Upper East Side': [
    'Fifth Avenue\u2019s Museum Mile, along the edge of the Upper East Side, is home to nine museums.',
    'The Metropolitan Museum of Art opened in its current Fifth Avenue building in 1880.',
  ],
  'Upper West Side': [
    'The American Museum of Natural History opened on the Upper West Side in 1877.',
    'The Dakota opened in 1884. The story goes that it was named for being so far uptown that it felt as remote as the Dakota Territory.',
  ],
  'West Village': [
    'The streets here predate Manhattan\u2019s 1811 grid, which is why they bend and cross at odd angles.',
    'The house at 75\u00BD Bedford Street is often called the narrowest in the city, at about nine and a half feet wide.',
  ],
  'Greenwich Village': [
    'The Washington Square Arch was first built of wood for a celebration in 1889, then replaced with marble in 1892.',
    'Washington Square Park once served as a burial ground, long before the chess tables arrived.',
  ],
  SoHo: [
    'SoHo means \u201CSouth of Houston Street,\u201D and Houston is pronounced \u201CHOW-ston.\u201D',
    'The SoHo Cast-Iron Historic District, designated in 1973, is often said to hold the largest collection of cast-iron architecture in the world.',
  ],
  Chelsea: [
    'The High Line, an old elevated freight railway turned into a park, first opened in 2009.',
    'The Chelsea Hotel was finished in 1884 and began as one of the city\u2019s first cooperative apartment buildings.',
  ],
  Flatiron: [
    'The Flatiron Building was first called the Fuller Building. New Yorkers renamed it for its shape, like a clothes iron.',
    'Shake Shack began in 2001 as a hot dog cart in Madison Square Park.',
  ],
  Gramercy: [
    'Gramercy Park, laid out in 1831, is still opened only with a key carried by residents of the surrounding buildings.',
  ],
  NoMad: [
    'NoMad is short for \u201CNorth of Madison Square Park,\u201D a nickname of recent decades for an old part of the city.',
    'The Little Church Around the Corner, on East 29th Street, dates to 1849.',
  ],
  'East Village': [
    'Tompkins Square Park, the East Village\u2019s green heart, has been open since the 1830s.',
    'Abraham Lincoln spoke at Cooper Union\u2019s Great Hall in February 1860, in the speech that helped carry him to the presidency.',
  ],
  'Lower East Side': [
    'The Tenement Museum on Orchard Street occupies a building that dates to 1863.',
    'Katz\u2019s Delicatessen on Houston Street has been serving since 1888.',
  ],
  'Financial District': [
    'Wall Street is named for the wall the Dutch built across lower Manhattan in the 1600s.',
    'The New York Stock Exchange traces its roots to the Buttonwood Agreement, signed by 24 brokers in 1792.',
  ],
  'Battery Park City': [
    'Battery Park City was built on landfill, including earth dug up while building the original World Trade Center.',
  ],
  Harlem: [
    'Harlem takes its name from Haarlem, a Dutch city. The settlement was named Nieuw Haarlem in 1658.',
    'The Apollo Theater\u2019s famous Amateur Night has been held since 1934.',
  ],
  'Brooklyn Heights': [
    'Brooklyn Heights became the city\u2019s first historic district in 1965.',
    'The Promenade was built over a highway, the Brooklyn-Queens Expressway, which opened in the 1950s.',
    'Walt Whitman\u2019s Leaves of Grass was printed in Brooklyn Heights in 1855.',
  ],
  DUMBO: [
    'DUMBO stands for \u201CDown Under the Manhattan Bridge Overpass.\u201D',
    'The Brooklyn Bridge, just beside DUMBO, opened in 1883 and was the longest suspension bridge in the world at the time.',
  ],
  'Cobble Hill': [
    'Cobble Hill is said to be named for a small hill that stood here in the 1700s, later leveled as the neighborhood was built.',
  ],
  'Carroll Gardens': [
    'Carroll Gardens has unusually deep front gardens, a quirk of the way its blocks were laid out in the 1840s.',
    'The neighborhood\u2019s streets honor Charles Carroll of Carrollton, the last surviving signer of the Declaration of Independence.',
  ],
  'Park Slope': [
    'Prospect Park, at the edge of Park Slope, covers 526 acres and was designed by Frederick Law Olmsted and Calvert Vaux, the pair behind Central Park.',
  ],
  Williamsburg: [
    'The Williamsburg Bridge opened in 1903.',
    'The Domino Sugar refinery on the Williamsburg waterfront opened in 1856.',
  ],
  Greenpoint: [
    'The USS Monitor, the Civil War ironclad, was built in Greenpoint, Brooklyn.',
  ],
  'Long Island City': [
    'Gantry Plaza State Park keeps the huge gantries that once loaded railroad cars onto barges.',
    'The Queensboro Bridge, which links Long Island City to Manhattan, opened in 1909.',
  ],
  Astoria: [
    'Kaufman Astoria Studios opened in 1920 and is still a working film studio.',
    'Astoria was renamed in the 1830s in honor of John Jacob Astor, then one of the richest men in America.',
  ],
}

export type HoodSpotlight = {
  name: string
  slug: string
  borough: 'manhattan' | 'brooklyn' | 'queens'
  fact: string
}

/** The number of the day in New York time, so everyone sees the same thing all day. */
export function dayNumberInNewYork(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return Math.floor(Date.UTC(get('year'), get('month') - 1, get('day')) / 86_400_000)
}

/** Today's fact for one neighborhood, or null when we have none for it yet. */
export function factForToday(name: string, now: Date = new Date()): string | null {
  const facts = NEIGHBORHOOD_FACTS[name]
  if (!facts?.length) return null
  const day = dayNumberInNewYork(now)
  const hoodIndex = NEIGHBORHOOD_TEXT.findIndex((h) => h.name === name)
  // Each neighborhood starts on a different fact, and all of them move along together each day.
  return facts[(day + Math.max(hoodIndex, 0)) % facts.length]
}

/** One neighborhood and one of its facts, changing every day. */
export function neighborhoodOfTheDay(now: Date = new Date()): HoodSpotlight {
  const day = dayNumberInNewYork(now)
  const hoods = NEIGHBORHOOD_TEXT
  const hood = hoods[day % hoods.length]
  const facts = NEIGHBORHOOD_FACTS[hood.name] ?? []
  const fact = facts.length ? facts[Math.floor(day / hoods.length) % facts.length] : hood.text
  return { name: hood.name, slug: slugify(hood.name), borough: hood.borough, fact }
}
