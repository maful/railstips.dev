import Head from 'next/head'
import { useRouter } from 'next/router'

import Navbar from 'components/ui/Navbar'
import { useUser } from '@/hooks/authUser'

interface LayoutProps {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any
}

export default function Layout({
  children,
  meta: pageMeta,
}: LayoutProps): JSX.Element {
  const router = useRouter()
  const { user } = useUser()
  const meta = {
    title: 'RailsTips - Find the most useful tips &amp; tricks',
    description:
      'Find the most useful tips &amp; tricks to make your code better',
    cardImage: '/og-image.jpeg',
    ...pageMeta,
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://railstips.dev${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@railstips_dev" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      {user && <Navbar />}
      <main>{children}</main>
    </>
  )
}
