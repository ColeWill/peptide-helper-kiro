export type PeptideTag =
  | "Fat Loss"
  | "Anti-Aging"
  | "Youthful Skin"
  | "Muscle Recovery";

export interface Peptide {
  id: string;
  name: string;
  tags: PeptideTag[];
  shortDescription: string;
  benefits: string[];
  imagePlaceholderUrl: string;
  researchNotes: string[];
  suggestedDosage: string;
}
