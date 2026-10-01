/**
 * Every photograph the site uses, in ONE place, so the same scenes recur and
 * the site reads as one. Unsplash (free licence only, never Unsplash+),
 * hotlinked through images.unsplash.com.
 *
 * Rules: nobody on a photo is named or captioned as a participant; `alt=""`;
 * every claim lives in the copy, never in a picture. Swap an id here and
 * nowhere else. Photographer credits are listed on the legal notice.
 */
export const photo = (id: string, w: number, h: number, crop: 'faces' | 'entropy' = 'faces') =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=${crop}&w=${w}&h=${h}&q=72`;

/* Picked by hand on unsplash.com — the page slug is in the comment so the
 * photographer can be credited and the picture found again. */
export const IDS = {
  /* A graduate holding her diploma, smiling — unsplash.com/photos/oBcWQjLX_t8 */
  heroGraduate: 'photo-1686213011624-8578b598ef0f',
  /* Two graduates in gowns walking down a street — PCYPAmfyvvs */
  graduation: 'photo-1692883702706-a50fc21da44f',
  /* One graduate in a gown, from behind — dGNvkOOCWeQ */
  graduationSolo: 'photo-1692883758975-cf33d6055bbe',
  /* Two women working on one laptop, plants around — 1g96LfUK3lU */
  cowork: 'photo-1653566031587-114b636e182b',
  /* A man and a woman going through a plan on a screen — 1FzEg5g7vt0 */
  mentoring: 'photo-1758876202980-0a28b744fb24',
  /* A handshake, close — n95VMLxqM2I (Nairobi) */
  handshake: 'photo-1521791136064-7986c2920216',
  /* Two men in suits over a laptop — MSTL7-5avQo */
  meetingRoom: 'photo-1758519288814-bb9f97e4df95',
  /* A woman at a table with a laptop, at home — ScanyB_RFAs */
  homeStudy: 'photo-1683534239440-3b741f48a7ea',
  /* A group of students around a laptop — -X4Qx4_4iMU */
  groupStudy: 'photo-1758270705518-b61b40527e76',
  /* Lomé from the air, the coast and the lagoon — QpPBoQw9O3U */
  lome: 'photo-1507975840173-2ea123318205',
  /* A young woman waving on a video call — DHrmBvaey5g */
  videoCall: 'photo-1758521541324-d304c5303fe5',
} as const;

export const PHOTOS = {
  hero: photo(IDS.heroGraduate, 900, 1100),
  teamCowork: photo(IDS.cowork, 640, 760),
  employersHandshake: photo(IDS.handshake, 960, 720, 'entropy'),
  programGraduation: photo(IDS.graduation, 720, 900),
  programMentoring: photo(IDS.mentoring, 760, 1040),
  employersHero: photo(IDS.handshake, 720, 900, 'entropy'),
  employersMeeting: photo(IDS.meetingRoom, 900, 760),
  applyStudy: photo(IDS.homeStudy, 720, 900),
  aboutGroup: photo(IDS.groupStudy, 900, 760),
  aboutCowork: photo(IDS.cowork, 900, 760),
  aboutVideoCall: photo(IDS.videoCall, 900, 760),
  lome: photo(IDS.lome, 1800, 1000, 'entropy'),
  polaroids: [
    photo(IDS.graduationSolo, 300, 300),
    photo(IDS.mentoring, 300, 300),
    photo(IDS.homeStudy, 300, 300),
    photo(IDS.groupStudy, 300, 300),
  ],
} as const;
