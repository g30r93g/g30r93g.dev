type Experience = {
  companyName: string;
  role: string;
  description?: string;
  slug: string;
  logo?: string;
  startDate: Date;
  endDate?: Date;
  url: string;
  companyUrl: string;
  content: string;
  skills?: string[];
  tools?: string[];
}

export default Experience;