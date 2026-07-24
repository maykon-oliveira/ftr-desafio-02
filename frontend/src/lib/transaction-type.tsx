import type { TransactionType } from "@/types";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import type React from "react";

type TransactionTypeOption = {
	label: string;
	value: TransactionType;
	icon: React.ReactElement
}

export const TransactionTypeLabel: Record<TransactionType, string> = {
	EXPENSE: "Despesa",
	INCOME: "Receita",
}

export const transactionTypesOptions: TransactionTypeOption[] = [
	{ label: "Despesa", value: "EXPENSE", icon: <ArrowDownCircleIcon /> },
	{ label: "Receita", value: "INCOME", icon: <ArrowUpCircleIcon /> },
]