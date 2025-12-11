type Project = {
  title: string;
  description?: string;
  slug: string;
  icon?: string;
  releaseDate?: Date;
  archived: boolean;
  status: "Completed" | "In Progress" | "On Hold" | "Archived";
  hostedUrl?: string;
  repoUrl: string;
  image?: string;
  highlight?: boolean;
  content: string;
  technologies?: string[];
};

export default Project;
