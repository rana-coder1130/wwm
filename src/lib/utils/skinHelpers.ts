export function slugify(name: string) {
	// Basic slugify: lower-case, replace spaces and punctuation with -, remove duplicate -, trim
	return name
		.toString()
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-') // spaces to -
		.replace(/[.,\/#!$%\^&\*;:{}=\_`~()\[\]]+/g, '') // remove punctuation
		.replace(/-{2,}/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function mkSkin(opts: {
	name: string;
	tag: string;
	source?: string;
	id?: string;
	hasFemale?: boolean;
	basePath?: string; // defaults to /images/skins
	alt?: string;
	imageMale?: string;
	imageFemale?: string;
	image?: string;
}) {
	const id = opts.id ?? slugify(opts.name);
	const basePath = opts.basePath ?? '/images/skins';
	const tag = opts.tag;
	const imageMale = opts.imageMale ?? `${basePath}/${tag}/${id}-male.jpg`;
	// Always include imageFemale property. If not provided, keep empty string for placeholder.
	const imageFemale =
		opts.imageFemale ?? (opts.hasFemale ? `${basePath}/${tag}/${id}-female.jpg` : '');
	const image = opts.image ?? `${basePath}/${tag}/${id}.jpg`;

	return {
		id,
		name: opts.name,
		tag: opts.tag,
		source: opts.source ?? '',
		imageMale,
		imageFemale,
		image,
		alt: opts.alt ?? `${opts.name} 外觀縮圖`
	} as const;
}

export function mkSkins(
	rows: Array<
		string | [name: string, tag?: string, source?: string, imageMale?: string, imageFemale?: string]
	>
) {
	return rows.map((r) => {
		if (typeof r === 'string') {
			// 'name' only, default tag: '直購'
			return mkSkin({ name: r, tag: '直購' });
		}
		const [name, tag = '直購', source, imageMale, imageFemale] = r;
		return mkSkin({ name, tag, source, imageMale, imageFemale });
	});
}
