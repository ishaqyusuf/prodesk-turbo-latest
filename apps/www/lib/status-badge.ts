export function getBadgeColor(status: string | null, _default = "slate") {
    return _getStatusColor(statusColor(status, _default));
}
export function statusColor(status, _default = "slate") {
    if (!status) return _default;
    let color: Colors | undefined = status
        ? StatusColorMap[(status?.toLowerCase() || "").replace(" ", "_")]
        : _default || ("slate" as any);
    return color || _default;
}
export function _getStatusColor(color) {
    if (!color) color = "slate";
    return `bg-${color}-500 hover:bg-${color}-600`;
}
const StatusColorMap: { [key: string]: Colors } = {
    active: "blue",
    queued: "orange",
    completed: "green",
    available: "green",
    success: "green",
    started: "blue",
    scheduled: "blue",
    incomplete: "orange",
    queue: "orange",
    in_progress: "fuchsia",
    cancelled: "red",
    pickup: "fuchsia",
    unknown: "orange",
    late: "red",
    in_transit: "fuchsia",
    approved: "emerald",
    verified: "emerald",
    assigned: "green",
    order_placed: "sky",
    delivery: "emerald",
    arrived_warehouse: "emerald",
    item_not_available: "orange",
    payment_cancelled: "orange",
    prod_queued: "orange",
    install: "purple",
    deco: "orange",
    evaluating: "orange",
    punchout: "emerald",
} as const;
// const __colors = Object.values(StatusColorMap) as const;
export type Colors =
    | "slate"
    | "gray"
    | "zinc"
    | "neutral"
    | "stone"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose"
    | "lightBlue"
    | "warmGray"
    | "trueGray"
    | "coolGray"
    | "blueGray";
