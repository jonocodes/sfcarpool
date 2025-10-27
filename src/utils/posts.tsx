export type PostType = {
  id: string;
  title: string;
  body: string;
};

export const fetchPost = async (id: string): Promise<PostType> => {
  console.info(`Fetching post with id ${id}...`);
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Post not found");
    }
    throw new Error("Failed to fetch post");
  }

  const post = (await res.json()) as PostType;
  return post;
};

export const fetchPosts = async (): Promise<PostType[]> => {
  console.info("Fetching posts...");
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts = (await res.json()) as Array<PostType>;
  return posts;
};
