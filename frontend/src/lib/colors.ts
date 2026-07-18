
export const colorsVariant = {
	green: {
		bg: "bg-green-base hover:bg-green-dark",
		light: "bg-green-light hover:bg-green-light",
		text: "text-green-dark",
		border: "border-green-dark"
	},
	blue: {
		bg: "bg-blue-base hover:bg-blue-dark",
		light: "bg-blue-light hover:bg-blue-light",
		text: "text-blue-dark",
		border: "border-blue-dark"
	},
	purple: {
		bg: "bg-purple-base hover:bg-purple-dark",
		light: "bg-purple-light hover:bg-purple-light",
		text: "text-purple-dark",
		border: "border-purple-dark"
	},
	pink: {
		bg: "bg-pink-base hover:bg-pink-dark",
		light: "bg-pink-light hover:bg-pink-light",
		text: "text-pink-dark",
		border: "border-pink-dark"
	},
	red: {
		bg: "bg-red-base hover:bg-red-dark",
		light: "bg-red-light hover:bg-red-light",
		text: "text-red-dark",
		border: "border-red-dark"
	},
	orange: {
		bg: "bg-orange-base hover:bg-orange-dark",
		light: "bg-orange-light hover:bg-orange-light",
		text: "text-orange-dark",
		border: "border-orange-dark"
	},
	yellow: {
		bg: "bg-yellow-base hover:bg-yellow-dark",
		light: "bg-yellow-light hover:bg-yellow-light",
		text: "text-yellow-dark",
		border: "border-yellow-dark"
	},
};

export const colors = [
	"green",
	"blue",
	"purple",
	"pink",
	"red",
	"orange",
	"yellow",
] as const;


export type ColorsType = typeof colors[number];