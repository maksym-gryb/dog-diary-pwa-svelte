// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: null | { id: string }
		}
		export const build: string[];
		export const files: string[];
		export const version: string;
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};