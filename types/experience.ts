type Experience = {
  companyName: string;
  role: string;
  description?: string;
  slug: string;
  logo?: string;
  logoBackground?: string;
  startDate: Date;
  endDate?: Date;
  highlight?: boolean;
  type: "work" | "education";
  url: string;
  companyUrl: string;
  content: string;
  skills?: string[];
  tools?: string[];
};

export default Experience;
