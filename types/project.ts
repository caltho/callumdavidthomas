export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  number: number;
  thumbnail: string;
  image: string[];
  techStack: string[];
  link: string;
  github: string;
  longDescription: string;
  year?: number;
  role?: string;
  codeblock?: {
    lang: string;
    desc: string[];
    code: string[];
  };
};
