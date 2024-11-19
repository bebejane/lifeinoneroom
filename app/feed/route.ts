import { getAllPosts } from "../../lib/posts";
import { render } from 'datocms-structured-text-to-plain-text';
import { Feed } from "feed";

export async function GET(request: Request) {
  const { allPosts } = await getAllPosts()

  const feed = new Feed({
    title: "Life In One Room",
    description: "Life in One Room is part of the project CRIP, produced by Konstfrämjandet Västmanland, with generous funding by Kulturbryggan",
    id: "lifeinoneroom",
    link: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    language: "en",
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
    favicon: `${process.env.NEXT_PUBLIC_SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
  });


  allPosts.forEach((post) => {
    const id = post.id;
    const title = post.__typename === "ImageRecord" ? post.textToVoice : post.title;
    //@ts-ignore
    const description = post.__typename === "ImageRecord" ? post.textToVoice : render(post.text);

    feed.addItem({
      title,
      id,
      link: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`,
      description,
      date: new Date(post._firstPublishedAt),
    });
  })

  return new Response(feed.rss2(), {
    status: 200,
    headers: { "Content-Type": "application/rss+xml" },
  });
}