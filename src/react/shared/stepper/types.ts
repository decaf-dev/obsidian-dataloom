export type Step = {
	title: string;
	description?: string;
	content: React.ReactNode;
	canContinue?: (() => boolean) | boolean;
	onBack?: () => void;
	onContinue?: () => boolean;
};
