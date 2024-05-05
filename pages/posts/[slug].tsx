import { bundleMDX } from "mdx-bundler";
import { getMDXComponent } from "mdx-bundler/client";
import Image from "next/image";
import ErrorPage from "next/error";
import { useRouter } from "next/router";

import Head from "next/head";
import { useMemo } from "react";
import BootstrapCarousel from "../../components/carousel";
import Container from "../../components/container";
import Header from "../../components/header";
import Highlighter from "../../components/highlighter";
import Layout from "../../components/layout";
import Map from "../../components/map";
import PostHeader from "../../components/post-header";
import PostTitle from "../../components/post-title";
import type PostType from "../../interfaces/post";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import { BLOG_NAME } from "../../lib/constants";
import FlexContainer from "../../components/flexContainer";
import OrderedList from "../../components/orderedList";

type Props = {
  post: PostType;
  morePosts: PostType[];
  preview?: boolean;
};

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const PostContent = useMemo(
    () => getMDXComponent(post.content),
    [post.content]
  );

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | {BLOG_NAME}
                </title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
              />
              <PostContent
                components={{
                  BootstrapCarousel,
                  FlexContainer,
                  Highlighter,
                  Image,
                  Map,
                  ol: OrderedList,
                }}
              />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);

  const { code: content, frontmatter: _ } = await bundleMDX({
    source: post.content,
  });

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
