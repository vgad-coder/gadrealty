/**
 * Fun facts for buildings Gad Realty has sold or rented in.
 * Only facts we could confirm from public building records or architectural history.
 * Ratings stay empty here: they are Vanessa's professional view and belong in the back office.
 */
export type BuildingFact = {
  address: string
  name?: string
  funFact: string
  doormanNote?: string
  lifestyleNote?: string
}

export const BUILDING_FACTS: BuildingFact[] = [
  {
    address: '5 Franklin Place',
    name: 'Franklin Place',
    funFact:
      'Franklin Place, finished in 2015, was designed by Eran Chen of ODA Architects, with interiors by Andres Escobar. It stands on a private cobblestone block in Tribeca, and an earlier design for the site was by UNStudio.',
    doormanNote: 'Full-time doorman, concierge and live-in superintendent.',
    lifestyleNote: 'On a quiet cobblestone street between White and Franklin, a short walk to the Hudson and the 1 train.',
  },
  {
    address: '166 East 63rd Street',
    name: 'Beekman Townhouse',
    funFact:
      'Beekman Townhouse was designed by Emery Roth & Sons and finished in 1959. It was converted to a condominium in 1990.',
    doormanNote: 'Full-time doorman, with a live-in superintendent and an attached garage.',
    lifestyleNote: 'Between Lexington and Third, a short walk to Central Park and the Lexington Avenue subway.',
  },
  {
    address: '376 Bergen Street',
    funFact:
      'This four-story, eight-unit co-op in Park Slope was built in 1920, in the years when Bergen Street was filling in with walk-up apartment houses.',
    lifestyleNote: 'Between Fourth and Fifth Avenues in Park Slope, a short walk to the F and G trains and Prospect Park.',
  },
  {
    address: '555 West 59th Street',
    name: 'Element',
    funFact:
      'Element was designed by SLCE Architects and finished around 2007\u201308. Its height was made possible by a through-block site after a rezoning of the old manufacturing blocks west of Lincoln Center.',
    doormanNote: 'Full-service condominium with an attended lobby.',
    lifestyleNote: 'Between Amsterdam and West End, a short walk to Lincoln Center, Columbus Circle and the Hudson.',
  },
  {
    address: '58 West 58th Street',
    name: 'Tower 58',
    funFact:
      'Tower 58 is a circular condominium designed by Samuel Paul and Seymour Jarmul and finished in 1969. It was built by Loews Theatres and converted to condominium in 1984, one block from Central Park.',
    doormanNote: 'Full-time doorman and concierge, with a live-in superintendent.',
    lifestyleNote: 'One block from Central Park and Fifth Avenue, with Columbus Circle and The Plaza a short walk away.',
  },
  {
    address: '555 Lenox Avenue',
    name: 'The Savoy West',
    funFact:
      'The Savoy West is a five-story Harlem condominium built in 1910 and later converted, keeping a pre-war walk-up scale on Lenox Avenue.',
    lifestyleNote: 'Central Harlem, near the 2, 3, B and C trains.',
  },
  {
    address: '171 14th Street',
    funFact: 'A Park Slope address on 14th Street, between the brownstone blocks and the Gowanus canal.',
    lifestyleNote: 'Park Slope, Brooklyn, with Prospect Park a short walk east.',
  },
  {
    address: '305 East 40th Street',
    name: 'The Hamilton',
    funFact:
      'The Hamilton was designed by Philip Birnbaum & Associates and finished in 1963. It was converted to a cooperative in 1983.',
    doormanNote: 'Full-service cooperative with a 24-hour concierge.',
    lifestyleNote: 'Murray Hill, a short walk to Grand Central, the United Nations and the Ford Foundation Building.',
  },
  {
    address: '403 East 62nd Street',
    funFact: 'A 19-story condominium finished in 1985, with 54 residences on the Upper East Side near the river.',
    lifestyleNote: 'Near the Queensboro Bridge and the East River, a short walk to the Second Avenue subway.',
  },
  {
    address: '753 St. Nicholas Avenue',
    funFact:
      'A 12-unit condominium finished in 2009, inside the Hamilton Heights / Sugar Hill Historic District, named for Alexander Hamilton\u2019s nearby estate.',
    lifestyleNote: 'Hamilton Heights, among the neighborhood\u2019s row houses and a short walk from City College.',
  },
  {
    address: '60 East 55th Street',
    name: 'Park Avenue Place',
    funFact:
      'Park Avenue Place was designed by Kohn Pedersen Fox, one of the firm\u2019s first residential towers, with interiors by Skidmore, Owings & Merrill. It was finished in the mid-2000s. The lower floors were built as private-club space.',
    doormanNote: 'Full-time doorman and concierge, with valet and a live-in superintendent.',
    lifestyleNote: 'Between Madison and Park Avenues in Midtown East.',
  },
  {
    address: '2 Columbus Avenue',
    funFact:
      'Two Columbus Avenue was designed by Buck & Cane Architects and finished in 1998. The developers bought the site and air rights from the neighboring Church of St. Paul the Apostle.',
    doormanNote: 'Full-service condominium.',
    lifestyleNote: 'At Columbus Circle, a short walk to Central Park, Lincoln Center and the A, B, C, D and 1 trains.',
  },
  {
    address: '753 Jefferson Avenue',
    funFact: 'A brick two-family house in Bedford-Stuyvesant, built in 1899, from the years when Jefferson Avenue was filling with row houses.',
    lifestyleNote: 'Bedford-Stuyvesant, Brooklyn, on a residential block of Jefferson Avenue.',
  },
  {
    address: '3635 Johnson Avenue',
    funFact: 'A Riverdale address on Johnson Avenue, in the Bronx neighborhood named for its views of the Hudson.',
    lifestyleNote: 'Riverdale, the Bronx, with the Hudson River a short walk west.',
  },
  {
    address: '242 West 76th Street',
    funFact:
      'Designed by George F. Pelham and finished in 1926 as a hotel (later the Milburn). It sits in the West End-Collegiate Historic District Extension.',
    lifestyleNote: 'Upper West Side, between Broadway and West End Avenue, a short walk to the 1, 2 and 3 trains.',
  },
  {
    address: '1123A Bay Ridge Parkway',
    funFact: 'A Bay Ridge address on the parkway that runs the length of the neighborhood, from the harbor toward Dyker Heights.',
    lifestyleNote: 'Bay Ridge, Brooklyn, with the harbor and Shore Road Park to the west.',
  },
  {
    address: '125 West 96th Street',
    funFact:
      'A six-story Upper West Side co-op designed by Sylvan Bien and built in 1920, at the corner of Columbus Avenue in Manhattan Valley.',
    lifestyleNote: 'Between Central Park and Riverside Park, with the B, C and 1 trains nearby.',
  },
  {
    address: '8725 24th Avenue',
    funFact: 'A Gravesend / Bensonhurst address on 24th Avenue, in the low-rise blocks of southern Brooklyn.',
    lifestyleNote: 'Southern Brooklyn, with the N train nearby.',
  },
  {
    address: '103 Battery Avenue',
    funFact: 'Battery Avenue in Brooklyn takes its name from the old harbor batteries that once guarded the Narrows.',
    lifestyleNote: 'Near the harbor in Brooklyn, a short walk toward Shore Road.',
  },
  {
    address: '427 East 85th Street',
    funFact: 'A four-story townhouse in Yorkville, built in 1925 on a 25-foot lot, of a type that still lines the side streets east of Lexington.',
    lifestyleNote: 'Upper East Side, a short walk to Carl Schurz Park and the East River.',
  },
  {
    address: '22-19 41st Street',
    funFact: 'An Astoria address on 41st Street, in the Queens neighborhood known for its Greek roots and for Astoria Park on the East River.',
    lifestyleNote: 'Astoria, Queens, with Astoria Park and the East River a short trip north.',
  },
  {
    address: '414 East 120th Street',
    funFact: 'East Harlem, on 120th Street, a few blocks from the Harlem River and the historic blocks of the neighborhood.',
    lifestyleNote: 'East Harlem, with the 6 train nearby.',
  },
  {
    address: '250 Ashland Place',
    name: 'The Ashland',
    funFact:
      'The Ashland, finished in 2016, was designed by FXFOWLE (now FXCollaborative) for the Gotham Organization. The west side is brick and limestone to face Fort Greene; the east side is glass, toward Downtown Brooklyn.',
    doormanNote: 'Full-service rental tower.',
    lifestyleNote: 'On the border of Fort Greene and Downtown Brooklyn, next to the BAM cultural district.',
  },
  {
    address: '226 15th Street',
    funFact: 'A four-story elevator condominium in South Slope, finished in 2008, with a common roof deck. Closings began in 2012.',
    lifestyleNote: 'Park Slope, between Fifth and Sixth Avenues, a short walk to Prospect Park.',
  },
  {
    address: '140 West End Avenue',
    name: 'Lincoln Towers',
    funFact:
      'Lincoln Towers was designed by S. J. Kessler & Sons and finished in the early 1960s as the residential part of Robert Moses\u2019s Lincoln Square renewal. 140 West End Avenue is the largest of the towers, with a certificate of occupancy dated 1965.',
    doormanNote: 'Full-time doorman and a superintendent on site.',
    lifestyleNote: 'Upper West Side, a short walk to Lincoln Center, Riverside Park and the 1 train.',
  },
  {
    address: '66 Rockwell Place',
    funFact:
      '66 Rockwell Place (also 29 Flatbush Avenue) was designed by Ismael Leyva Architects and finished in 2014. The 42-story rental was developed by The Dermot Company, with a lounge on the top floor.',
    doormanNote: 'Full-service rental tower.',
    lifestyleNote: 'Downtown Brooklyn, a short walk to Fort Greene Park and the BAM cultural district.',
  },
  {
    address: '550 West 54th Street',
    name: 'Mercedes House',
    funFact:
      'Mercedes House was designed by Enrique Norten of TEN Arquitectos and finished in 2012. The mixed-use tower, developed by Two Trees, wraps around a Mercedes-Benz showroom at the base.',
    doormanNote: 'Full-service rental with an attended lobby.',
    lifestyleNote: 'Hell\u2019s Kitchen, between Tenth and Eleventh Avenues, a short walk to the Hudson River Park.',
  },
  {
    address: '212 West 91st Street',
    name: 'The Greystone',
    funFact:
      'The Greystone was designed by Schwartz & Gross and opened in 1923 as an apartment hotel, on land bought from the Astor estate at Broadway and 91st Street.',
    doormanNote: 'Full-time doorman.',
    lifestyleNote: 'Upper West Side, at Broadway and 91st Street, a short walk to Riverside Park and the 1, 2 and 3 trains.',
  },
  {
    address: '3701 Henry Hudson Parkway',
    funFact: 'A seven-story elevator co-op in Riverdale, built in 1954, looking toward the Henry Hudson Parkway and the river beyond.',
    lifestyleNote: 'Riverdale, the Bronx, with Hudson River views nearby.',
  },
  {
    address: '405 West 57th Street',
    funFact:
      'A six-story Art Deco / Streamline Moderne co-op finished in 1940, designed by H. Herbert Lilien, with its original lobby still in place.',
    doormanNote: 'Attended lobby (hours vary).',
    lifestyleNote: 'Midtown West, two blocks from Central Park and a short walk to Columbus Circle.',
  },
  {
    address: '35 East 68th Street',
    name: 'Dunham House',
    funFact:
      'Dunham House is a limestone mansion designed by Thomas Hastings of Carr\u00E8re & Hastings, the firm behind the New York Public Library, and finished in 1901 for Dr. Edward Kellogg Dunham. It was converted to an eight-unit co-op in 1977 and landmarked in 1981.',
    lifestyleNote: 'Upper East Side, between Madison and Park, one block from Central Park.',
  },
  {
    address: '936 Fifth Avenue',
    funFact:
      '936 Fifth Avenue, designed by H. J. Harmon and finished in 1955, replaced two earlier mansions on Museum Mile, including a townhouse by Carr\u00E8re & Hastings. It sits across from the former Harkness house at 1 East 75th Street.',
    doormanNote: 'Full-service cooperative.',
    lifestyleNote: 'Fifth Avenue at 75th Street, facing Central Park, on Museum Mile.',
  },
  {
    address: '800 Fifth Avenue',
    funFact:
      '800 Fifth Avenue is a postmodern apartment tower designed by Ulrich Franzen & Associates and finished in 1978, facing Central Park at 61st Street.',
    doormanNote: 'Full-service building.',
    lifestyleNote: 'Fifth Avenue at 61st Street, facing Central Park.',
  },
  {
    address: '165 East 72nd Street',
    funFact: 'A 20-story Upper East Side cooperative finished in 1960, with about 183 residences.',
    doormanNote: 'Full-service cooperative.',
    lifestyleNote: 'Upper East Side, a short walk to Central Park and the Lexington Avenue subway.',
  },
]
