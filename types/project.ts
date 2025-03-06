type Project = {
  title: string;
  description?: string;
  slug: string;
  icon?: string;
  releaseDate?: Date;
  archived: boolean;
  url: string;
  image?: string;
  content: string;
}

export default Project;