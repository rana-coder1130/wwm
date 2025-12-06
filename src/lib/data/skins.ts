import type { SkinCategory, SkinCollection } from '$lib/types';
import { mkSkin } from '$lib/utils/skinHelpers';

const skinCategories: SkinCategory[] = [
	{
		id: 'shop',
		title: '直購',
		desc: '商城直購、禮包取得的常駐外觀'
	},
	{
		id: 'battle-pass',
		title: '戰令',
		desc: '戰令等級獎勵、賽季令牌取得的外觀'
	},
	{
		id: 'event',
		title: '和鳴',
		desc: '限定活動外觀'
	}
];

const skinEntries = [
	{
		name: '人間仙',
		categoryId: 'event',
		source: '商店',
		imageMale: '/images/skins/和鳴/人間仙_男.png',
		imageFemale: '/images/skins/和鳴/人間仙_女.png'
	},
	{
		name: '樂神師延',
		categoryId: 'event',
		source: '商店',
		imageMale: '/images/skins/和鳴/樂神師延_男.png',
		imageFemale: '/images/skins/和鳴/樂神師延_女.png'
	}
];

function buildCollections(): SkinCollection[] {
	return skinCategories.map((category) => ({
		title: category.title,
		desc: category.desc,
		items: skinEntries
			.filter((entry) => entry.categoryId === category.id)
			.map((entry) =>
				mkSkin({
					name: entry.name,
					tag: category.title,
					source: entry.source,
					imageMale: entry.imageMale,
					imageFemale: entry.imageFemale
				})
			)
	}));
}

export const skinCollections: SkinCollection[] = buildCollections();
