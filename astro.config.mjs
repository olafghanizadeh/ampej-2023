import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import storyblok from '@storyblok/astro';
import { loadEnv } from 'vite';

import { remarkReadingTime } from './src/utils/frontmatter.js';

import { SITE } from './src/config.mjs';
const env = loadEnv(import.meta.env.MODE, process.cwd(), 'STORYBLOK');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	// Astro uses this full URL to generate your sitemap and canonical URLs in your final build
	site: SITE.origin,
	base: SITE.basePathname,
	trailingSlash: SITE.trailingSlash ? 'always' : 'never',

	output: 'static',

	integrations: [
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
		sitemap(),
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}),
		mdx(),
		storyblok({
			accessToken: import.meta.env.MODE === 'development' ? env.STORYBLOK_PREVIEW_TOKEN : env.STORYBLOK_PUBLIC_TOKEN,
			components: {
				// Add your components here
				blogPost: 'storyblok/BlogPost',
				blogPostList: 'storyblok/BlogPostList',
				page: 'storyblok/Page',
				teaser: 'storyblok/Teaser',
				hero: 'components/widgets/Hero',
				keynoteSpeakers: 'components/widgets/KeynoteSpeakers',
				comittees: 'components/widgets/Comittees',
				keyDates: 'components/widgets/KeyDates',
				organizers: 'components/widgets/Organizers',
				callForPapers: 'components/widgets/CallForPapers',
				registration: 'components/widgets/Registration',
				accomodations: 'components/widgets/Accomodations',
				paymentSteps: 'components/widgets/PaymentSteps',
				programmeWidget: 'components/widgets/ProgrammeWidget',
			},
			apiOptions: {},
		}),
	],

	markdown: {
		remarkPlugins: [remarkReadingTime],
		extendDefaultPlugins: true,
	},

	vite: {
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
			},
		},
	},
});
