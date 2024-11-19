import fs from "fs";
import RSS from "rss";
import { render } from 'datocms-structured-text-to-plain-text';
import { getAllPosts } from "./posts";

export default async function generateRssFeed() {
  const { allPosts } = await getAllPosts()

  const site_url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3000";

  const feedOptions = {
    title: "Life In One Room | RSS Feed",
    description: "Life In One Room | Blog",
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    image_url: `${site_url}/images/rss_logo.jpeg`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}`,
  };

  const feed = new RSS(feedOptions);

  // Add each individual post to the feed.
  allPosts.map((post) => {
    const title = post.__typename === "ImageRecord" ? post.textToVoice : post.title;
    const description = post.__typename === "ImageRecord" ? post.textToVoice : render(post.text);

    feed.item({
      title,
      description,
      url: `${site_url}/posts/${post.slug}`,
      date: post._firstPublishedAt,
    });
  });

  // Write the RSS feed to a file as XML.
  fs.writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
}