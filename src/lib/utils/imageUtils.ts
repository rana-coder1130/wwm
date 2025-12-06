export function resolveSkinImage(image?: string | null, fallbackId?: string | null) {
	const prefix = '/images/skins/';
	const value = image ?? fallbackId;
	if (!value) return undefined;
	// Already an absolute path
	if (value.startsWith('/')) return value;
	// Already a relative images/skins path
	if (value.startsWith('images/skins/')) return '/' + value;
	// Already includes the folder but missing leading slash
	if (value.startsWith('images/')) return '/' + value;
	// If the value has a dot, assume extension provided (e.g., 'foo.jpg')
	if (value.includes('.')) return prefix + value;
	// Otherwise append default extension
	return prefix + value + '.jpg';
}

export default resolveSkinImage;
