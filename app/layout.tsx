import '@styles/index.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AboutDocument, GlobalDocument } from '@graphql';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { ThemeContextProvider } from '@components/theme/ThemeContext';
import Head from 'next/head';
import ThemeProvider from '@components/theme/ThemeProvider';
import Navbar from '@/components/Navbar';
import Readingline from '@/components/Readingline';
import AboutModal from '@/components/AboutModal';

export type LayoutProps = {
	children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
	const { about, introduction } = await apiQuery<AboutQuery, AboutQueryVariables>(AboutDocument);

	return (
		<>
			<html lang='en'>
				<Head>
					<link
						rel='alternate'
						type='application/rss+xml'
						title='Example Feed'
						href={`${process.env.NEXT_PUBLIC_SITE_URL}/feed`}
					/>
				</Head>
				<a href='#main' style={{ position: 'absolute', top: '-100px', left: '-100px', zIndex: -1 }}>
					Skip to main content
				</a>
				<ThemeContextProvider>
					<ThemeProvider>
						<Navbar />
						<AboutModal about={about} introduction={introduction} />
						<main id='main'>{children}</main>
						<Readingline />
					</ThemeProvider>
				</ThemeContextProvider>
			</html>
		</>
	);
}

export async function generateMetadata() {
	const {
		site: { globalSeo, faviconMetaTags },
	} = await apiQuery<GlobalQuery, GlobalQueryVariables>(GlobalDocument);

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		title: {
			template: `${globalSeo?.siteName}`,
			default: globalSeo?.siteName,
		},
		description: globalSeo?.fallbackSeo?.description,
		image: globalSeo?.fallbackSeo?.image?.url,
		icons: faviconMetaTags.map(({ attributes: { rel, sizes, type, href: url } }) => ({
			rel,
			url,
			sizes,
			type,
		})) as Icon[],
		openGraph: {
			title: globalSeo?.siteName,
			description: globalSeo?.fallbackSeo?.description,
			url: process.env.NEXT_PUBLIC_SITE_URL,
			siteName: globalSeo?.siteName,
			images: [
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=1200&h=630&fit=fill&q=80`,
					width: 800,
					height: 600,
					alt: globalSeo?.siteName,
				},
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=1600&h=800&fit=fill&q=80`,
					width: 1600,
					height: 800,
					alt: globalSeo?.siteName,
				},
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=790&h=627&fit=crop&q=80`,
					width: 790,
					height: 627,
					alt: globalSeo?.siteName,
				},
			],
			locale: 'en_US',
			type: 'website',
		},
		alternates: {
			canonical: process.env.NEXT_PUBLIC_SITE_URL,
			types: {
				'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed`,
			},
		},
	} as Metadata;
}
