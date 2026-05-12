export type Stuff = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  number: number;
  thumbnail: string;
  image: string[];
  links: { label: string; href: string }[];
  longDescription: string;
  year?: number;
  location?: string;
};
