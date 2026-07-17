import { cn } from "@/lib/utils";
import type { IconType } from "./type";

type IconProps = {
	iconName: IconType
} & React.ComponentProps<"img">

export function Icon({ className, iconName, ...props }: IconProps) {
	return <img
		src={`/src/assets/Icon/${iconName}.svg`}
		className={cn(
			"size-4 ",
			className
		)}
		{...props}
	/>
}