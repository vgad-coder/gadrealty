/** The neighborhood descriptions shown on the Neighborhoods page. */
export type HoodText = { name: string; borough: 'manhattan' | 'brooklyn' | 'queens'; text: string }

export const NEIGHBORHOOD_TEXT: HoodText[] = [
  { name: 'Tribeca', borough: 'manhattan', text: 'Cobblestone streets, former warehouses turned spacious lofts, and sunsets along the Hudson. Downtown living with room to breathe.' },
  { name: 'Upper East Side', borough: 'manhattan', text: 'Museum afternoons, Madison Avenue windows, and a favorite bench in Central Park. Classic New York, with plenty to discover beyond the grand facades.' },
  { name: 'Upper West Side', borough: 'manhattan', text: 'Bagels on Broadway, evenings at Lincoln Center, and two beautiful parks to choose from. A neighborhood where the everyday routine has its own charm.' },
  { name: 'West Village', borough: 'manhattan', text: 'Winding streets, tucked-away gardens, and caf\u00e9s that invite you to linger. Getting a little lost is part of the pleasure.' },
  { name: 'Greenwich Village', borough: 'manhattan', text: 'Washington Square chess games, jazz behind unassuming doors, and streets filled with literary history. There\u2019s always a story around the corner.' },
  { name: 'SoHo', borough: 'manhattan', text: 'Cast-iron buildings, soaring loft windows, and shopping that can turn a quick stroll into an afternoon. Look up\u2014the architecture deserves as much attention as the boutiques.' },
  { name: 'Chelsea', borough: 'manhattan', text: 'Gallery hopping, High Line walks, and a neighborhood built for exploring. Historic townhouses and contemporary buildings share the same lively streets.' },
  { name: 'Flatiron', borough: 'manhattan', text: 'An unmistakable skyline landmark and Madison Square Park at its heart. Handsome architecture gives even a coffee run a sense of occasion.' },
  { name: 'Gramercy', borough: 'manhattan', text: 'Leafy blocks, elegant townhouses, and glimpses of a famously private park. A quieter rhythm tucked into the middle of Manhattan.' },
  { name: 'NoMad', borough: 'manhattan', text: 'Grand buildings and lively streets just north of Madison Square Park. Historic New York with a decidedly contemporary social life.' },
  { name: 'East Village', borough: 'manhattan', text: 'Community gardens, vintage finds, and a musical history that still gives the streets their personality. A neighborhood that has never been afraid to do things differently.' },
  { name: 'Lower East Side', borough: 'manhattan', text: 'Old tenements, contemporary galleries, and generations of stories packed into a few blocks. Small storefronts often hold the biggest surprises.' },
  { name: 'Financial District', borough: 'manhattan', text: 'Winding streets trace the city\u2019s beginnings beneath some of its tallest towers. History at street level, drama when you look up.' },
  { name: 'Battery Park City', borough: 'manhattan', text: 'Waterfront paths, leafy parks, and front-row views of the harbor. A place to slow down without leaving Manhattan.' },
  { name: 'Harlem', borough: 'manhattan', text: 'Brownstone blocks, jazz history, and avenues rich with cultural landmarks. Beautiful architecture is only the beginning of its story.' },
  { name: 'Brooklyn Heights', borough: 'brooklyn', text: 'Quiet brownstone streets lead to one of the city\u2019s great skyline views. The Promenade makes an ordinary evening walk feel special.' },
  { name: 'DUMBO', borough: 'brooklyn', text: 'Cobblestones, converted warehouses, and the Manhattan Bridge framed between buildings. The waterfront is spectacular, but the side streets deserve a look too.' },
  { name: 'Cobble Hill', borough: 'brooklyn', text: 'Small shops, handsome row houses, and a pocket park made for a pause. A neighborhood that rewards taking the long way home.' },
  { name: 'Carroll Gardens', borough: 'brooklyn', text: 'Front gardens, brownstones, and Italian roots give these streets a distinctive warmth. Here, the walk to your corner shop is part of the appeal.' },
  { name: 'Park Slope', borough: 'brooklyn', text: 'Brownstones, stoops, and Prospect Park just around the corner. Weekend plans can be as simple as choosing which direction to wander.' },
  { name: 'Williamsburg', borough: 'brooklyn', text: 'Industrial buildings, independent shops, and waterfront views across to Manhattan. Creative energy runs from the side streets to the shoreline.' },
  { name: 'Greenpoint', borough: 'brooklyn', text: 'Polish bakeries, wood-frame houses, and reminders of its maritime past. A neighborhood with plenty of character between the avenues and the waterfront.' },
  { name: 'Long Island City', borough: 'queens', text: 'Former factories share the landscape with modern towers and art spaces. Along the river, Manhattan puts on quite a show.' },
  { name: 'Astoria', borough: 'queens', text: 'Greek roots, a rich mix of cultures, and streets full of neighborhood discoveries. Astoria Park adds open skies and sweeping bridge views.' },
]

/** First sentence is the headline; the rest is the body. */
export function splitText(text: string): { tagline: string; body: string } {
  const i = text.indexOf('. ')
  if (i < 0) return { tagline: text, body: '' }
  return { tagline: text.slice(0, i + 1), body: text.slice(i + 2) }
}
