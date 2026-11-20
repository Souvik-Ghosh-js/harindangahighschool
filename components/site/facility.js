import { Flask, Monitor, Music, Trophy, Star, Award } from "../Icons";

export const THEMES = ["t-blue", "t-gold", "t-green", "t-coral"];
export const theme = (i) => THEMES[i % THEMES.length];

/* Pick a clear icon for a facility from its title. */
export function facilityIcon(title = "") {
  const t = title.toLowerCase();
  if (/lab|science/.test(t)) return Flask;
  if (/comput|digital|tech/.test(t)) return Monitor;
  if (/cultur|music|dance|art/.test(t)) return Music;
  if (/sport|game|athlet|physical/.test(t)) return Trophy;
  if (/scholar|credit|award/.test(t)) return Award;
  return Star;
}
