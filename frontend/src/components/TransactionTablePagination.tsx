import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";


function paginationRange(currentPage: number, totalPages: number): (number | "ellipsis")[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	const pages: (number | "ellipsis")[] = [1]

	if (currentPage > 3) {
		pages.push("ellipsis")
	}

	const start = Math.max(2, currentPage - 1)
	const end = Math.min(totalPages - 1, currentPage + 1)

	for (let i = start; i <= end; i++) {
		pages.push(i)
	}

	if (currentPage < totalPages - 2) {
		pages.push("ellipsis")
	}

	pages.push(totalPages)

	return pages
}

type TransactionTablePaginationProps = {
	page: number
	pageSize: number
	totalCount: number
	onPageChange: (page: number) => void
	className?: string
}

export function TransactionTablePagination({ page, totalCount, pageSize, onPageChange }: TransactionTablePaginationProps) {

	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
	const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
	const to = Math.min(page * pageSize, totalCount)

	const pages = paginationRange(page, totalPages)
	return (
		<div className="flex justify-between items-center px-5">
			<div className="flex-1 text-left font-normal">
				{from} a {to} | {totalCount} resultados
			</div>
			<Pagination className="mx-0 w-min">
				<PaginationContent>
					{page > 1 && (
						<PaginationItem>
							<PaginationPrevious text="" onClick={() => onPageChange(page - 1)} />
						</PaginationItem>
					)}
					{pages.map((p, i) =>
						<PaginationItem key={i}>
							{p === "ellipsis" ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink
									onClick={() => onPageChange(p)}
									isActive={p === page}
									className={cn(p === page ? 'bg-brand-base text-white hover:bg-brand-dark hover:text-white' : '')}
								>
									{p}
								</PaginationLink>
							)}
						</PaginationItem>
					)}
					{(page < totalPages) && (
						<PaginationItem>
							<PaginationNext text="" onClick={() => onPageChange(page + 1)} />
						</PaginationItem>
					)}
				</PaginationContent>
			</Pagination>
		</div>
	)
}