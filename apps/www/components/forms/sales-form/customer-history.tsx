import { Label } from "@/components/ui/label";

export function CustomerHistory({ customerId }) {
    return (
        <div className="">
            <Label>Recent Sales</Label>
            <Label>Payments</Label>
            {/* Allow interactions such as send reminder on sales, process payment etc */}
        </div>
    );
}
