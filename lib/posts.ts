import { apiQuery } from "next-dato-utils/api"
import { AllPostsDocument, PostDocument } from "../graphql"

export const getAllPosts = async (): Promise<{ allPosts: (ImageRecord | TextRecord)[], draftUrl: string }> => {
  const { allImages, allTexts, draftUrl } = await apiQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, {
    all: true,
    tags: ['image', 'text']
  })

  const allPosts = allImages.concat(allTexts as any).sort((a, b) => a._firstPublishedAt > b._firstPublishedAt ? -1 : 1) as (ImageRecord | TextRecord)[]
  return { allPosts, draftUrl }
}


export const getPost = async (slug: string): Promise<{ post: ImageRecord | TextRecord | null, draftUrl: string }> => {
  const { image, text, draftUrl } = await apiQuery<PostQuery, PostQueryVariables>(PostDocument, {
    variables: { slug },
  })
  return { post: image as ImageRecord || text as TextRecord || null, draftUrl }
}