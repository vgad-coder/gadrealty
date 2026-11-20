import { slugify } from './slug'

/**
 * The Tip of the Week library: 104 plain-English tips on buying, selling, renting,
 * co-ops and condos, and renovating in New York.
 *
 * One tip is featured each week (Monday to Sunday, New York time) and the whole list
 * can be browsed on the Tip of the Week page. When the list runs out it starts again.
 *
 * Rules and fees change, so tips that mention a law or a fee are written in general terms.
 * Add, change or remove tips freely: each is a title, a topic and one to three short paragraphs.
 */
export type TipTopic = 'buying' | 'selling' | 'renting' | 'co-ops-and-condos' | 'renovating'

export const TIP_TOPICS: { id: TipTopic; label: string }[] = [
  { id: 'buying', label: 'Buying' },
  { id: 'selling', label: 'Selling' },
  { id: 'renting', label: 'Renting' },
  { id: 'co-ops-and-condos', label: 'Co-ops and Condos' },
  { id: 'renovating', label: 'Renovating' },
]

type RawTip = { title: string; body: string[] }

const BUYING: RawTip[] = [
  {
    title: 'Get Pre-Approved Before You Tour',
    body: [
      'A pre-approval letter tells you what you can really spend, and it tells sellers and co-op boards you are serious. Get it before the first showing, not after you fall in love with an apartment.',
      'Ask your lender for a few different scenarios, so you know the monthly payment at several prices.',
    ],
  },
  {
    title: 'Know the Real Monthly Cost',
    body: [
      'The price is only part of the story. Add the mortgage, the monthly maintenance or common charges, and property taxes if they are billed separately.',
      'In a co-op, maintenance often includes the building\u2019s property taxes. In a condo, taxes usually come on top of common charges. Compare homes by their total monthly cost, not by price alone.',
    ],
  },
  {
    title: 'Budget for Closing Costs',
    body: [
      'Closing costs are usually a few percent of the price, and condos tend to cost more than co-ops. Expect attorney fees, lender fees, title insurance for most condos and houses, and building fees.',
      'Ask your broker and attorney for a written estimate early, so nothing surprises you at the closing table.',
    ],
  },
  {
    title: 'Understand the \u201CMansion Tax\u201D',
    body: [
      'New York State charges buyers a one-time tax on residential purchases of $1 million or more. It starts at 1% of the price and steps up at higher prices.',
      'It is paid by the buyer at closing, so build it into your budget. Your attorney can confirm exactly what applies to your purchase.',
    ],
  },
  {
    title: 'Hire a New York Real Estate Attorney Early',
    body: [
      'In New York, attorneys handle the contract. Choose yours before you make an offer, so you can sign quickly when the seller accepts.',
      'A good attorney reviews the building\u2019s documents, spots problems, and explains what you are agreeing to in plain language.',
    ],
  },
  {
    title: 'Look at the Building, Not Just the Apartment',
    body: [
      'You can renovate a kitchen. You cannot easily change the roof, the boiler, the lobby or the neighbors.',
      'Walk the hallways and the lobby, ask about the roof, windows, boiler and elevators, and notice how well the building is kept. It tells you how it will be run.',
    ],
  },
  {
    title: 'Ask for the Building\u2019s Financials',
    body: [
      'In a co-op or condo, the building\u2019s finances are part of what you buy. Ask for recent financial statements, the reserve fund balance, and any planned repairs or assessments.',
      'A healthy building has savings set aside and a plan for big expenses. A building with neither may send you a large bill later.',
    ],
  },
  {
    title: 'Read the Board Minutes',
    body: [
      'Recent minutes show what the board is actually dealing with: leaks, lawsuits, repairs, rule changes, and the topic nobody mentions on tours.',
      'Ask your broker to request the last year of minutes before you sign a contract.',
    ],
  },
  {
    title: 'Visit at Different Times of Day',
    body: [
      'An apartment can feel very different at 8 a.m., at noon and on a Friday night. Light, noise, foot traffic and the commute all change.',
      'If you can, return at a second time before you make an offer.',
    ],
  },
  {
    title: 'Check the Light, Noise and Water Pressure',
    body: [
      'Open the windows and listen. Run the shower and a kitchen faucet at the same time. Check which way the windows face and what is across the street.',
      'These small checks take five minutes and can save you years of small annoyances.',
    ],
  },
  {
    title: 'Measure Before You Fall in Love',
    body: [
      'Floor plans can be generous and photographs are wide-angle. Bring a tape measure for the rooms that matter: where the bed, sofa and desk will go.',
      'Check ceiling heights, closet space, and whether your largest piece of furniture can get up the stairs or into the elevator.',
    ],
  },
  {
    title: 'What an Inspection Can Tell You',
    body: [
      'A home inspector looks at what you can\u2019t easily see: plumbing, wiring, windows, signs of leaks, and the condition of appliances.',
      'In a co-op or condo, an inspection covers your apartment. In a house, it can include the roof, foundation and heating. Either way, it gives you facts to negotiate with.',
    ],
  },
  {
    title: 'Think About Resale From Day One',
    body: [
      'You may love the quirky layout, but the next buyer decides how easy it will be to sell. Natural light, a sensible floor plan, good storage and a strong location hold their value.',
      'Ask yourself what you would say about the apartment to a friend who is shopping next.',
    ],
  },
  {
    title: 'Make an Offer That Tells a Story',
    body: [
      'Price matters, but sellers also want confidence. A strong pre-approval, a flexible closing date and a prepared attorney make an offer feel safe.',
      'Your broker can explain what the seller cares about most, which is not always the highest number.',
    ],
  },
  {
    title: 'Don\u2019t Skip the Final Walk-Through',
    body: [
      'Just before closing, visit the apartment again. Check that agreed repairs were made, that the appliances and fixtures in your contract are still there, and that nothing was damaged in the move out.',
      'It is much easier to fix a problem before the closing than after.',
    ],
  },
  {
    title: 'Know Exactly What Is Included',
    body: [
      'Appliances, light fixtures, window treatments and built-ins are only part of the sale if the contract says so.',
      'Walk through with your broker and list anything you expect to stay. Put it in writing.',
    ],
  },
  {
    title: 'Learn the Neighborhood by Walking It',
    body: [
      'Find the grocery store, the pharmacy, the nearest subway stop and the coffee place you will go to on Sunday. Walk it as you would on an ordinary day.',
      'The neighborhood is half of what you are buying.',
    ],
  },
  {
    title: 'Compare Recent Sales, Not Asking Prices',
    body: [
      'An asking price is a hope. A sale price is a fact. Ask your broker for recent sales of similar apartments in the same building or on the same block.',
      'Those numbers show you where the market really is and give you ground to negotiate on.',
    ],
  },
  {
    title: 'Be Ready for the Timeline',
    body: [
      'After an offer is accepted, the contract usually comes within a couple of weeks, and the closing follows in a month or two. A co-op board approval can add time.',
      'Keep documents ready, answer your lender quickly, and plan your move around the closing date.',
    ],
  },
  {
    title: 'Keep Your Finances Steady Until Closing',
    body: [
      'Lenders check again just before closing. A new job, a big purchase, a new credit card or a large unexplained deposit can slow things down or put the loan at risk.',
      'Until the keys are in your hand, keep your finances as they were when you were approved.',
    ],
  },
  {
    title: 'Ask Why the Seller Is Selling',
    body: [
      'A seller who needs to move quickly will often make different choices from one who can wait. Your broker can often learn what drives the timing and the price.',
      'That knowledge is useful when you decide how to shape your offer.',
    ],
  },
  {
    title: 'Ask About Tax Abatements',
    body: [
      'Some New York homes carry a property tax abatement or exemption that lowers the taxes for a set number of years. When it ends, the taxes can rise.',
      'Ask how long the benefit lasts and what the taxes will be afterward, so you are comparing the real costs.',
    ],
  },
  {
    title: 'Ask About Storage, Bikes and Packages',
    body: [
      'Storage cages, bike rooms, package rooms and laundry look like small things until you live without them.',
      'Ask what the building offers, whether it costs extra, and whether there is a waiting list.',
    ],
  },
  {
    title: 'Look at the Whole Block',
    body: [
      'Scaffolding, a construction site next door, a nightlife corner or a new tower going up across the street can change your day-to-day life.',
      'The city\u2019s building permits are public. Your broker can help you see what is planned nearby.',
    ],
  },
]

const SELLING: RawTip[] = [
  {
    title: 'What to Fix Before You Sell',
    body: [
      'Buyers notice more than you think. Start with what buyers and inspectors look at first: safety, systems and surfaces that show. A working boiler, tidy wiring, sound windows and fresh paint speak louder than any listing description.',
      'Then leave the rest alone. A renovation done for the buyer is rarely the renovation the buyer wants. Walk through with someone who builds and decide what is worth doing before the photographer arrives.',
    ],
  },
  {
    title: 'Price It Right From the Start',
    body: [
      'The first weeks bring the most attention. An apartment priced too high can sit, and a home that lingers starts to look flawed.',
      'Pricing is based on recent sales of similar homes, the condition of yours, and the market today, not on what you hope to get or what you spent on the renovation.',
    ],
  },
  {
    title: 'Declutter and Depersonalize',
    body: [
      'Buyers need to imagine their own life in your home. Clear countertops, pack away family photographs, and keep only what you need in closets.',
      'A tidy apartment also looks larger.',
    ],
  },
  {
    title: 'Photographs Do the First Showing',
    body: [
      'Most buyers meet your home online before they ever step inside. Bright, sharp, well-composed photographs decide whether they come to see it.',
      'Prepare the apartment for the camera: clean, lit, uncluttered, with the best view on show.',
    ],
  },
  {
    title: 'Light Is Free',
    body: [
      'Open the curtains, clean the windows and replace dim bulbs. Natural light is among the most valuable things in a New York apartment, so show all of it.',
      'Turn on every lamp for showings, even in the daytime.',
    ],
  },
  {
    title: 'Paint Is the Best Return',
    body: [
      'A fresh coat in a quiet, neutral color makes a home feel cared for and costs very little compared to its effect.',
      'Fix scuffs and nail holes, touch up the trim and ceilings, and do the whole room, not just the worst wall.',
    ],
  },
  {
    title: 'Gather Your Building Documents Early',
    body: [
      'Buyers\u2019 attorneys will ask for the building\u2019s financials, house rules, and for a co-op the proprietary lease and recent minutes. Collecting them before you list speeds up the contract.',
      'Ask your managing agent what is available and how long it takes to get.',
    ],
  },
  {
    title: 'Know Your Net, Not Just Your Price',
    body: [
      'What you keep is the price minus the mortgage payoff, broker commission, transfer taxes, attorney fees and any building charges.',
      'Ask for a written estimate of your net proceeds before you set a price, so you know what each offer means for you.',
    ],
  },
  {
    title: 'Understand the Flip Tax',
    body: [
      'Many co-ops charge a fee on resale, often called a flip tax. How much it is, and who pays it, varies by building.',
      'Ask your managing agent for the number early so you can include it in your plans.',
    ],
  },
  {
    title: 'Be Flexible With Showings',
    body: [
      'The more easily buyers can see your home, the more of them will. Evenings and weekends matter, and so does being ready on short notice.',
      'Leaving during showings lets buyers speak freely and picture themselves living there.',
    ],
  },
  {
    title: 'Judge Offers by Strength, Not Just Price',
    body: [
      'The highest offer is not always the best one. Look at the buyer\u2019s financing, the size of the down payment, the timeline, and, in a co-op, how likely the board is to approve.',
      'A slightly lower offer that closes is worth more than a higher one that falls apart.',
    ],
  },
  {
    title: 'Sell the Neighborhood, Too',
    body: [
      'People buy a way of life. Tell buyers what is around the corner: the park, the good bakery, the subway, the school, the farmers market.',
      'Your listing and your showings should mention the places you love.',
    ],
  },
  {
    title: 'Disclose What You Know',
    body: [
      'Past leaks, noise, repairs and building issues tend to come out during the process. Being upfront builds trust and avoids surprises later.',
      'Ask your attorney what you are required to disclose and what is wise to share.',
    ],
  },
  {
    title: 'The First Two Weeks Matter',
    body: [
      'A new listing gets the most attention when it is fresh. Be ready on day one: right price, clean home, great photographs, documents on hand.',
      'It is hard to get a second first impression.',
    ],
  },
  {
    title: 'Hire an Attorney Before You List',
    body: [
      'Having your attorney lined up lets you move quickly when an offer arrives. They can review building documents and prepare the contract in advance.',
      'A smooth contract stage keeps buyers confident.',
    ],
  },
  {
    title: 'Keep Records of Your Renovations',
    body: [
      'Buyers and their attorneys ask about past work. Keep receipts, permits, the board\u2019s approval letters and contractor details together in one folder.',
      'Documented work reassures buyers and can support your price.',
    ],
  },
  {
    title: 'Stage the Rooms That Matter',
    body: [
      'You do not need to stage every corner. Focus on the living room, the primary bedroom and the kitchen. These are the rooms buyers remember.',
      'Simple furniture arrangement, fresh linens and a few plants go a long way.',
    ],
  },
  {
    title: 'Fix the Smell',
    body: [
      'Pets, cooking, smoke and damp can all linger, and you may no longer notice them. Ask a friend to be honest.',
      'Air the home out, clean thoroughly, and avoid strong air fresheners, which can make buyers wonder what you are hiding.',
    ],
  },
  {
    title: 'Check Your Building\u2019s Showing Rules',
    body: [
      'Some buildings have rules about how and when showings and open houses can happen, and who must be notified.',
      'Ask your managing agent early so your broker can plan around them.',
    ],
  },
  {
    title: 'Listen to the Feedback',
    body: [
      'If many buyers mention the same thing, whether it is the price, the smell or the layout, it is worth hearing.',
      'Your broker should share the comments honestly and help you decide whether to adjust.',
    ],
  },
  {
    title: 'Coordinate Your Sale and Your Next Purchase',
    body: [
      'If you are buying your next home, the timing of the two closings matters. Talk to your broker, attorney and lender about whether to sell first, buy first, or line them up together.',
      'There is no single answer. It depends on your finances and your market.',
    ],
  },
  {
    title: 'Walk Through as a Buyer Would',
    body: [
      'Start at the front door and look at everything fresh: scuffed walls, a sticky window, a dripping tap, a crowded closet.',
      'Small problems add up in a buyer\u2019s mind, and most are quick to fix.',
    ],
  },
  {
    title: 'Plan Your Move Early',
    body: [
      'Most buildings require you to reserve the elevator, and movers often have to provide proof of insurance. Some buildings ask for a deposit.',
      'Book your date as soon as the closing date is set.',
    ],
  },
  {
    title: 'Negotiation Doesn\u2019t End at the Offer',
    body: [
      'After you accept an offer, there is still the inspection, the contract, the financing, the board package and the closing.',
      'Each step can bring a new question. Stay responsive and keep your broker and attorney close.',
    ],
  },
]

const RENTING: RawTip[] = [
  {
    title: 'Start Looking 30 to 60 Days Ahead',
    body: [
      'Most apartments are listed shortly before they open up, and good ones go quickly. Starting about a month or two ahead gives you time to see enough homes without rushing.',
      'Looking much earlier rarely helps, because landlords do not know what will be available.',
    ],
  },
  {
    title: 'Get Your Documents Ready',
    body: [
      'Landlords usually ask for photo ID, proof of income such as pay stubs or an offer letter, recent tax returns and bank statements, and references.',
      'Keep them in one folder on your phone, so you can apply the same day you find the place you love.',
    ],
  },
  {
    title: 'Know the 40 Times Rule',
    body: [
      'Many New York landlords ask that your annual income be at least 40 times the monthly rent. For a $3,000 apartment, that is $120,000 a year.',
      'If you do not meet it, a guarantor or extra security may help. Ask what the landlord accepts.',
    ],
  },
  {
    title: 'How a Guarantor Works',
    body: [
      'A guarantor is someone who agrees to cover your rent if you cannot. Landlords often ask for a higher income multiple from a guarantor than from a tenant, and some prefer guarantors who live in the tri-state area.',
      'Ask the landlord what they require before you ask a family member.',
    ],
  },
  {
    title: 'Who Pays the Broker Fee',
    body: [
      'Under New York City\u2019s FARE Act, which took effect in 2025, the person who hires the broker generally pays that broker\u2019s fee. For a listing, that is usually the landlord.',
      'Always ask, in writing, what fees you will be charged before you apply.',
    ],
  },
  {
    title: 'Know the Security Deposit Rules',
    body: [
      'In New York State, a landlord generally cannot ask for more than one month\u2019s rent as a security deposit for a residential lease.',
      'After you move out, the landlord has a limited time to return it or send an itemized list of deductions. Keep your move-out photos.',
    ],
  },
  {
    title: 'Watch the Application Fee',
    body: [
      'State law limits the fee a landlord can charge to run a background and credit check to a small amount. If you are being asked to pay far more, ask why.',
      'Ask what the fee covers before you pay.',
    ],
  },
  {
    title: 'Read the Lease, Line by Line',
    body: [
      'Check the term, the renewal terms, how much notice is needed to leave, who pays for repairs, and the rules on guests, pets and subletting.',
      'If something is unclear, ask before you sign. Once you sign, the lease is the agreement.',
    ],
  },
  {
    title: 'Check the Heat and Hot Water',
    body: [
      'In New York City, landlords must provide heat during heat season, which runs from October 1 through May 31, and hot water all year.',
      'On your visit, ask how the building is heated and look at the radiators. Ask current tenants what winter is like.',
    ],
  },
  {
    title: 'Ask About Bedbugs and Pests',
    body: [
      'New York City landlords must give tenants a notice about the building\u2019s bedbug history. Ask for it, and ask about pests in general.',
      'Look under the sink and in the corners of closets when you tour.',
    ],
  },
  {
    title: 'Learn if It Is Rent Stabilized',
    body: [
      'A rent-stabilized apartment has limits on rent increases and gives the tenant the right to renew. Ask whether the apartment is stabilized and request its rent history.',
      'It is one of the most valuable things to know before you sign.',
    ],
  },
  {
    title: 'Window Guards and Safety',
    body: [
      'In New York City, landlords must install window guards if a child 10 or younger lives in the apartment, and tenants can ask for them at any time.',
      'Also check smoke and carbon monoxide detectors, locks and the intercom on the day you tour.',
    ],
  },
  {
    title: 'Visit at Night and on a Weekend',
    body: [
      'A quiet block at noon can be loud at midnight. Check the street at different hours, and listen from inside the apartment.',
      'Look at the lobby, the stairs and the entrance after dark, too.',
    ],
  },
  {
    title: 'Test Cell Service and Laundry',
    body: [
      'Check your phone signal in every room, and ask where laundry is: in the unit, in the basement, or down the block.',
      'These everyday details shape your life more than the finishes.',
    ],
  },
  {
    title: 'Take Move-In Photos',
    body: [
      'On your first day, photograph every wall, floor, appliance and any damage. Email the photos to the landlord or building manager so there is a dated record.',
      'It protects your security deposit when you leave.',
    ],
  },
  {
    title: 'Get Renter\u2019s Insurance',
    body: [
      'A landlord\u2019s insurance covers the building, not your belongings. Renter\u2019s insurance is inexpensive and also covers liability if something happens in your home.',
      'Some buildings require it.',
    ],
  },
  {
    title: 'Know the Rules on Roommates',
    body: [
      'New York law gives many tenants the right to share an apartment with a roommate, with limits on the total number of occupants.',
      'Check your lease and ask the landlord how to add a roommate properly, so everyone is protected.',
    ],
  },
  {
    title: 'Negotiate More Than the Rent',
    body: [
      'If the rent is firm, there may be room elsewhere: a free month, a longer or shorter lease, a start date, a repair or a paint job before move-in.',
      'Ask politely and ask early. The answer is often more flexible than you expect.',
    ],
  },
  {
    title: 'Co-op and Condo Rentals Have Extra Steps',
    body: [
      'When you rent in a co-op or condo, the building usually reviews you as well as the owner. There can be an application, an interview, move-in fees and a deposit.',
      'Ask how long the building\u2019s approval takes so you can plan your move.',
    ],
  },
  {
    title: 'Plan Moving Day Early',
    body: [
      'Buildings often require you to reserve the elevator and have your movers provide proof of insurance. Street parking for a truck may need a permit.',
      'Book the movers and the building at the same time as you sign.',
    ],
  },
]

const CO_OPS_AND_CONDOS: RawTip[] = [
  {
    title: 'Co-op or Condo: What You Actually Own',
    body: [
      'In a co-op, you own shares in a corporation and a proprietary lease for your apartment. In a condo, you own the apartment itself, as real property.',
      'That difference shapes the purchase: how you are approved, what you pay at closing, and what you can do with the home later.',
    ],
  },
  {
    title: 'Start the Co-op Board Package Early',
    body: [
      'A board package usually includes an application, tax returns, bank and investment statements, references and a financial summary. It takes time to assemble.',
      'Be complete, neat and consistent. Boards read the whole thing, and a missing page can cost you weeks.',
    ],
  },
  {
    title: 'Prepare for the Board Interview',
    body: [
      'The interview is usually friendly and brief. Boards want to know you will be a good neighbor and can afford the home.',
      'Be on time, be honest, answer clearly, and have a question or two about the building.',
    ],
  },
  {
    title: 'Debt, Income and Savings After Closing',
    body: [
      'Many co-ops look at your debt-to-income ratio and want to see savings left after the closing, sometimes a year or more of housing costs.',
      'Rules vary by building. Ask your broker what a building typically expects before you make an offer.',
    ],
  },
  {
    title: 'Maintenance and Common Charges Are Not the Same',
    body: [
      'Co-op maintenance pays for building operations and usually includes the building\u2019s property taxes and its mortgage. Condo common charges pay for operations, and taxes are billed separately.',
      'When you compare a co-op and a condo, compare the total cost each month.',
    ],
  },
  {
    title: 'Ask About the Underlying Mortgage',
    body: [
      'Many co-ops carry a mortgage of their own. How large it is, its rate and when it comes due all affect the building\u2019s finances and your monthly costs.',
      'Ask for it in the financial statements.',
    ],
  },
  {
    title: 'Ask About Special Assessments',
    body: [
      'A special assessment is a one-time charge to owners, often for a major repair. Ask whether there are any now, whether any are planned, and when the last one was.',
      'Buildings with large reserves tend to have fewer of them.',
    ],
  },
  {
    title: 'Check the Reserve Fund',
    body: [
      'The reserve fund is the building\u2019s savings for big repairs. Ask how large it is and what it is meant to cover.',
      'A building that plans ahead is easier on its owners.',
    ],
  },
  {
    title: 'Learn the Sublet Policy',
    body: [
      'Some co-ops allow owners to rent out their apartments only for a limited time, or not at all. Condos are usually more flexible, but have rules too.',
      'If you might move for work or travel, ask early what is allowed.',
    ],
  },
  {
    title: 'Check the House Rules',
    body: [
      'House rules cover noise, floor coverings, pets, laundry, deliveries, move-in hours and renovations.',
      'Read them before you buy. They describe what daily life in the building is like.',
    ],
  },
  {
    title: 'Understand Pied-\u00E0-Terre and Gift Rules',
    body: [
      'Some co-ops limit who can buy, including buyers who will not live there full time, or who plan to gift the apartment to family.',
      'If your plans are unusual, tell your broker at the start so you look at the right buildings.',
    ],
  },
  {
    title: 'Know About the Right of First Refusal',
    body: [
      'Some condos give the building the right to buy an apartment on the same terms as a buyer\u2019s offer. It is not often used, but it exists.',
      'Ask whether the building you like has it.',
    ],
  },
  {
    title: 'Co-ops Can Limit Financing',
    body: [
      'Many co-ops limit how much you can borrow, and require a larger down payment than a condo would. Some buildings are cash-friendly or prefer all-cash buyers.',
      'Ask what a building requires before you fall for an apartment there.',
    ],
  },
  {
    title: 'Compare Closing Costs by Type',
    body: [
      'Condo and co-op purchases involve different fees. Condos usually include title insurance and a mortgage recording tax. Co-ops have an application fee, a move-in deposit and other building charges.',
      'Ask your attorney for a cost estimate for the exact home you are considering.',
    ],
  },
  {
    title: 'Learn Who Manages the Building',
    body: [
      'The managing agent runs the day-to-day, from repairs to financials. How responsive they are shapes your experience.',
      'Ask residents what they think, and look at how quickly the staff handles small problems.',
    ],
  },
  {
    title: 'Look at the Owner-Occupancy Rate',
    body: [
      'A high share of owner-occupants, rather than investors, generally helps a condo\u2019s stability. It can also affect which lenders will finance a purchase there.',
      'Ask your broker and lender about it early.',
    ],
  },
  {
    title: 'Get the Right Insurance',
    body: [
      'The building insures the structure, but not your belongings or the inside of your apartment. Co-op and condo owners usually buy their own policy.',
      'A good policy covers your belongings, improvements and liability. Ask your insurance agent which fits your building.',
    ],
  },
  {
    title: 'Ask About Facade Work',
    body: [
      'New York City requires regular inspections of facades on larger buildings, and repairs can be costly. Ask when the last inspection was, and whether work is planned.',
      'Scaffolding outside your windows for a year is worth knowing about before you buy.',
    ],
  },
]

const RENOVATING: RawTip[] = [
  {
    title: 'Get Board Approval Before You Demo',
    body: [
      'In a co-op or condo, most renovations need written approval first, through an alteration agreement. It sets the work hours, insurance, rules for the common areas and what the board must see.',
      'Read it with your contractor before you sign. Starting without approval can stop the job.',
    ],
  },
  {
    title: 'Hire Licensed, Insured Contractors',
    body: [
      'Plumbers and electricians in New York City must be licensed, and your building will want a certificate of insurance from your contractor.',
      'Ask for references, look at finished work, and get everything in writing: scope, price, schedule and payments.',
    ],
  },
  {
    title: 'Know When You Need a Permit',
    body: [
      'Moving walls, plumbing, gas lines and electrical work usually need filings with the city, and often the building\u2019s approval first. Painting and small repairs usually do not.',
      'Ask your contractor or architect who files, who pays and how long it takes.',
    ],
  },
  {
    title: 'Add 10 to 20 Percent for Surprises',
    body: [
      'Walls and floors hide things. A budget with a cushion of 10 to 20 percent lets you handle surprises without stopping the job.',
      'If you do not need it, you have saved money.',
    ],
  },
  {
    title: 'Plan the Schedule Around the Building',
    body: [
      'Buildings usually limit work to certain hours on weekdays, and require elevator reservations and protection for the hallways.',
      'Those rules affect how fast work moves, so build them into the schedule from the start.',
    ],
  },
  {
    title: 'Order Long-Lead Items First',
    body: [
      'Windows, custom millwork, stone, tile and some appliances can take weeks or months to arrive. Order them early, so the work never waits.',
      'A beautiful kitchen with a missing countertop is a very expensive way to wait.',
    ],
  },
  {
    title: 'Expect Surprises in Prewar Buildings',
    body: [
      'Older buildings are beautiful, and they can hide old plumbing, outdated wiring and uneven walls.',
      'Ask your contractor to open a small test area early, and plan for what you find.',
    ],
  },
  {
    title: 'Kitchens and Baths Deserve the Care',
    body: [
      'Buyers and tenants look hardest at kitchens and bathrooms. Good layout, solid fixtures and clean finishes matter more than the most expensive options.',
      'Spend where you will see and touch it every day.',
    ],
  },
  {
    title: 'Staging and Painting Before a Sale',
    body: [
      'If you plan to sell, small improvements can matter more than a big renovation: fresh paint, repaired floors, new light fixtures, and good staging.',
      'Talk to a broker who understands construction, and decide what is worth doing before you spend.',
    ],
  },
  {
    title: 'Plan for Sound and Floors',
    body: [
      'Many buildings require sound-reducing underlayment when floors are replaced, and sometimes rugs over most of the floor.',
      'Check the rules before you choose a floor, so the beautiful one you pick is also allowed.',
    ],
  },
  {
    title: 'Layout First, Finishes Second',
    body: [
      'A good plan is what makes a home work. Decide where walls, doors, light and storage go before you choose tile and paint.',
      'Finishes are easy to change later. Layouts are not.',
    ],
  },
  {
    title: 'Combining Apartments Takes Time',
    body: [
      'Joining two apartments usually needs board approval, structural review and filings with the city. It is rewarding, but it is one of the longest projects.',
      'Start the approvals early, and talk to the building before you commit to the plan.',
    ],
  },
  {
    title: 'Check Your Electrical Capacity',
    body: [
      'Older apartments may have limited electrical service. Central air conditioning, a new kitchen or an induction cooktop can need more.',
      'Have your electrician check the panel early, before you choose appliances.',
    ],
  },
  {
    title: 'Choose Finishes You Will Still Like',
    body: [
      'Trends change faster than tile. Choose a calm, classic palette for the big, expensive surfaces, and use paint, lighting and accessories for style that can change.',
      'It is better for your enjoyment and for resale.',
    ],
  },
  {
    title: 'Keep a Change-Order Log',
    body: [
      'Every change to the plan affects price and schedule. Write each one down, with the cost and the new timing, and approve it in writing.',
      'It keeps the budget honest and avoids arguments later.',
    ],
  },
  {
    title: 'Protect the Common Areas',
    body: [
      'Hallways, elevators and lobbies need protection during a renovation, and the building may hold a deposit against damage.',
      'Respecting the neighbors and the staff makes the project smoother for everyone.',
    ],
  },
  {
    title: 'Finish With a Punch List',
    body: [
      'When the work is nearly done, walk through with your contractor and list everything still to fix: touch-ups, adjustments, missing pieces.',
      'Hold back the final payment until the list is complete, and keep the paperwork and any sign-offs the building or the city requires.',
    ],
  },
  {
    title: 'Townhouses: Start With the Envelope',
    body: [
      'In a townhouse, begin with what keeps the building sound: roof, facade, windows, and the heating, plumbing and electrical systems.',
      'Finish the structure first, and the beautiful rooms will last.',
    ],
  },
]

const GROUPS: [TipTopic, RawTip[]][] = [
  ['buying', BUYING],
  ['selling', SELLING],
  ['renting', RENTING],
  ['co-ops-and-condos', CO_OPS_AND_CONDOS],
  ['renovating', RENOVATING],
]

export type Tip = {
  /** 1 for the first tip, counting up. Shown as \u201CNo. 12\u201D. */
  number: number
  slug: string
  title: string
  topic: TipTopic
  body: string[]
}

/** One topic after another in turn, so the weekly tip changes subject from week to week. */
function interleave(): Tip[] {
  const queues = GROUPS.map(([topic, tips]) => ({ topic, tips: [...tips] }))
  const out: Tip[] = []
  while (queues.some((q) => q.tips.length)) {
    for (const q of queues) {
      const next = q.tips.shift()
      if (!next) continue
      out.push({
        number: out.length + 1,
        slug: `tip-${out.length + 1}-${slugify(next.title).slice(0, 60)}`.replace(/-+$/, ''),
        title: next.title,
        topic: q.topic,
        body: next.body,
      })
    }
  }
  return out
}

export const TIPS: Tip[] = interleave()

export const topicLabel = (topic: TipTopic) => TIP_TOPICS.find((t) => t.id === topic)?.label ?? topic

/** Monday 2026-11-16 starts the first week of tips. Every Monday (New York time) the next tip takes over. */
const FIRST_MONDAY = Date.UTC(2026, 10, 16)

function weekNumberInNewYork(now: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const today = Date.UTC(get('year'), get('month') - 1, get('day'))
  return Math.floor((today - FIRST_MONDAY) / (7 * 86_400_000))
}

/** This week's tip. The list begins again after the last tip. */
export function tipOfTheWeek(now: Date = new Date()): Tip {
  const week = weekNumberInNewYork(now)
  const index = ((week % TIPS.length) + TIPS.length) % TIPS.length
  return TIPS[index]
}

export const tipBySlug = (slug: string): Tip | undefined => TIPS.find((t) => t.slug === slug)
