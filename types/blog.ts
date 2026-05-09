type BlogPost = {
  title: string;
  description?: string;
  slug: string;
  url: string;
  publishedDate: Date;
  updatedDate?: Date;
  tags?: string[];
  draft: boolean;
  content: string;
};

export default BlogPost;
