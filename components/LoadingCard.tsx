import { Skeleton } from "./ui/skeleton"

export default function LoadingCard() { 
    const cards = Array(15).fill(null)
    return (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex flex-col space-y-3">
                <Skeleton className="w-full aspect-5/2 rounded-xl"></Skeleton>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"></Skeleton>
                    <Skeleton className="h-4 w-full"></Skeleton>
                </div>
            </div>
        </div>
    )
}