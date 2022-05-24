import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { getPosts } from '@shared/get-posts'
import hydrate from 'next-mdx-remote/hydrate'
import PostLayout from '@layouts/post'
import { POSTS_DIR } from 'config'
import mdxComponents from '@shared/mdx-components'
import type { FormatedPost, PostFile } from '@shared/types'

export default function Post({
  mdxContent,
  frontMatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const content = hydrate(mdxContent, { components: mdxComponents })
  return (
    <PostLayout frontMatter={frontMatter}>
      <header>
        <h1>{frontMatter.title}</h1>
      </header>
      <article>{content}</article>
    </PostLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts('./posts')

  const paths = posts.map(({ slug }) => ({
    params: {
      slug,
    },
  }))
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const { slug: routeSlug } = params as { slug: string }
  const posts = await getPosts(POSTS_DIR)

  const { mdx, frontMatter } = posts.find(
    ({ slug: postSlug }) => postSlug === routeSlug
  ) as Required<FormatedPost>

  return {
    props: {
      mdxContent: mdx,
      frontMatter,
    },
  }
}
