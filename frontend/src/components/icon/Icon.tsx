import type { LucideProps } from "lucide-react";

import { Icons, type IconType } from "./type";

type IconProps = {
	iconName: IconType
} & LucideProps;

export function Icon({ iconName, ...props }: IconProps) {
	const IconComponent = Icons[iconName];

	return <IconComponent {...props} />;
}