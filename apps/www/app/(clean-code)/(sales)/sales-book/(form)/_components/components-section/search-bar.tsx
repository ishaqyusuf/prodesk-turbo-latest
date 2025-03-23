import { Input } from "@/components/ui/input";
import { UseStepContext } from "./ctx";
import { cn } from "@/lib/utils";

interface Props {
    ctx: UseStepContext;
}
export default function SearchBar({ ctx }: Props) {
    if (ctx.tabComponents?.length < 15) return null;
    return (
        <div>
            <Input
                disabled={ctx.selectionState?.count > 0}
                className={cn(
                    "h-8",
                    ctx.selectionState?.count > 0 ? "w-16" : ""
                )}
                placeholder="Search"
                defaultValue={ctx.q}
                onChange={(e) => ctx.setQ(e.target.value)}
            />
        </div>
    );
}
