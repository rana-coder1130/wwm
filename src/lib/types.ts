export interface ChecklistTask {
	id: string;
	text: string;
	sub: string;
	type?: 'counter' | 'group';
	max?: number;
	days?: number[]; // 0=Sunday, 1=Monday, etc.
	trackLifetime?: boolean;
	limit?: number;
	subList?: ChecklistTask[];
	category?:
		| 'core'
		| 'optional'
		| 'social'
		| 'micro'
		| 'timed'
		| 'weekly-shop'
		| 'weekly-activity'
		| 'weekly-misc';
}

export interface ChecklistData {
	daily: ChecklistTask[];
	weekly: ChecklistTask[];
}

export interface TimerItem {
	id: string;
	name: string;
	source: string;
	cat: string;
}

export interface GearData {
	[key: string]: {
		type: string;
		drop: string;
		p2: string;
		p4: string;
	};
}

export interface BuildStyle {
	rec?: string[];
	branches?: {
		[key: string]: string[];
	};
	gear: string[];
}

export interface AffixItem {
	part: string;
	priority?: string[];
	effect?: string;
}

export interface ResourceItem {
	category: string;
	title: string;
	tag?: string;
	content: string;
	note?: string;
	location?: string;
}
