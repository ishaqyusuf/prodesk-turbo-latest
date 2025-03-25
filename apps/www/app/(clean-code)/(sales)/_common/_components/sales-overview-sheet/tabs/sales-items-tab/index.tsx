import { AdminOnly } from "../../helper";

import { salesOverviewStore } from "../../store";
import { cn, percent, sum } from "@/lib/utils";
import Money from "@/components/_v1/money";
import { Badge } from "@/components/ui/badge";
import { ItemOverview } from "./item-overview";
import { ProductionHeader } from "./header";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ItemsTabProvider,
  useItemsTabContext,
} from "@/components/sheets/sales-overview-sheet/items-tab-context";

export function SalesItemsTab({ productionMode = false }) {
  const store = salesOverviewStore();
  const ctx = useItemsTabContext();
  const itemOverview = store.itemOverview;
  if (!itemOverview) return;
  const { noItem, items, tab, setTab } = ctx;

  return (
    <div className="pb-36">
      <ItemsTabProvider value={ctx}>
        <AdminOnly>
          <ProductionHeader />
        </AdminOnly>
        {noItem ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <Label>No item</Label>
          </div>
        ) : (
          items.map((item) => (
            <div className="flex flex-col gap-2" key={item.itemControlUid}>
              {item.primary && item.sectionTitle && (
                <div className="uppercase py-2 bg-muted text-center font-mono font-semibold">
                  {item.sectionTitle}
                </div>
              )}
              {!item.hidden && item.status?.qty?.total && (
                <div
                  className={cn(
                    item.sectionTitle && "",
                    "border border-transparent border-b-muted-foreground/20 rounded-b-none rounded-lg",
                    item.itemControlUid != store.itemViewId
                      ? "cursor-pointer hover:bg-muted/80 hover:shadow-lg hover:border-muted-foreground/30"
                      : "border border-muted-foreground/60 shadow-sm bg-muted/30",
                    ctx.selectMode && "cursor-pointer",
                  )}
                >
                  <div
                    className={cn("p-2 pt-4 text-sm", "space-y-2")}
                    onClick={() => {
                      if (ctx.selectMode) {
                        ctx.toggeItemSelection(item.itemControlUid);
                        return;
                      }
                      store.update("itemViewId", item.itemControlUid);
                      store.update("itemView", item);
                    }}
                  >
                    <div className="">
                      <div className="flex gap-6 justify-between">
                        <div className="flex-1 font-semibold font-mono uppercase">
                          {item.title}
                          <span>
                            {ctx.isSelected(item.itemControlUid) && (
                              <Badge>Selected</Badge>
                            )}
                          </span>
                        </div>
                        <div className="font-mono text-sm font-medium">
                          <AdminOnly>
                            <Money value={item.totalCost} />
                          </AdminOnly>
                        </div>
                      </div>
                      <div className="uppercase font-mono text-muted-foreground font-semibold">
                        <span>{item.inlineSubtitle}</span>
                      </div>
                    </div>
                    {item.lineConfigs?.length && (
                      <div className="flex gap-4 justify-end">
                        {item.lineConfigs?.map((c) => (
                          <Badge
                            key={c}
                            className="font-mono font-semibold"
                            variant="outline"
                          >
                            {c}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex pt-2 gap-6">
                      <div className="flex-1 flex justify-end">
                        {item.produceable && (
                          <>
                            <div className="flex-1">
                              <Pill
                                label="Assigned"
                                value={`${item.status?.prodAssigned?.total}/${item.status?.qty?.total}`}
                              />
                            </div>
                            <div className="flex-1">
                              <Pill
                                label="Completed"
                                value={`${item.status?.prodCompleted?.total}/${item.status?.qty?.total}`}
                              />
                            </div>
                          </>
                        )}
                        {item.shippable && (
                          <div className="flex-1">
                            <Pill
                              label="FulFilled"
                              value={`${sum([
                                item.status?.dispatchCompleted?.total,
                                item.status?.dispatchAssigned?.total,
                                item.status?.dispatchInProgress?.total,
                              ])}/${item.status?.qty?.itemTotal}`}
                            />
                          </div>
                        )}
                      </div>
                      <div className=""></div>
                    </div>
                  </div>
                  {item.itemControlUid == store.itemViewId &&
                    !ctx.selectMode && <ItemOverview />}
                </div>
              )}
            </div>
          ))
        )}
      </ItemsTabProvider>
    </div>
  );
}
function Pill({ label, value }) {
  const [score, total] = value
    ?.split(" ")
    ?.filter(Boolean)
    ?.reverse()?.[0]
    ?.split("/");
  const _percent = percent(score, total);
  return (
    <div
      className={cn(
        "flex whitespace-nowrap uppercase font-semibold font-mono text-xs text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "px-1 rounded-full shadow border",
          _percent < 100 && "text-cyan-600 bg-cyan-100 border-cyan-200",
          !_percent && "text-red-600 bg-red-100 border-red-200",
          _percent >= 100 &&
            "text-emerald-600 bg-emerald-100 border-emerald-200",
        )}
      >
        {label}: {value}
      </span>
    </div>
  );
}
