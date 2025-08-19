import { notFound } from 'next/navigation';
import { RenderBuilderContent, builder } from '@builder.io/sdk-react';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

async function fetchContent(pathname: string) {
  return await builder
    .get('page', {
      userAttributes: {
        urlPath: pathname,
      },
      options: {
        includeRefs: true,
      },
    })
    .toPromise();
}

export async function generateStaticParams() {
  const pages = await builder.getAll('page', {
    options: { noTargeting: true },
  });
  return pages.map((page) => ({
    page: page.data?.url?.split('/').filter(Boolean) || [],
  }));
}

export default async function Page({ params }: { params: { page: string[] } }) {
  const pathname = '/' + params.page.join('/');
  const content = await fetchContent(pathname);

  if (!content) {
    notFound();
  }

  return <RenderBuilderContent model="page" content={content} />;
}
