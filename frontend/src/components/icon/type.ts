
const ALL_ICONS = [
	"shopping-cart",
	"utensils",
	"house",
	"dumbbell",
	"heart-pulse",
	"book-open",
	"briefcase-business",
	"gift",
	"wallet",
	"piggy-bank",
	"car-front",
	"receipt-text",
	"tag",
	"tool-case",
	"ticket",
	"paw-print",
	"plus",
	"trash",
	"square-pen"
] as const;

export type IconType = typeof ALL_ICONS[number];