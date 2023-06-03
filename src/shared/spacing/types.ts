export type SpacingSize =
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "2xl"
	| "3xl"
	| "4xl"
	| "unset";

export interface DynamicSize<T> {
	base: T;
	mobile?: T;
}
