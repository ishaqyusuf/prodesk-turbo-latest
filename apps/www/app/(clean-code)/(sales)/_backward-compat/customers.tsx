import { Menu } from "@/components/(clean-code)/menu";
import { chunker } from "@/lib/chunker";

import {
    customerSynchronize,
    harvestCustomers,
    uniqueables,
    updateUniques,
} from "./customer.action";

export default function Customers({}) {
    function woker() {
        harvestCustomers().then((list) => {
            console.log(list);
            // return;
            chunker({
                worker: customerSynchronize,
                list: list.filteredGroups,
            });
        });
    }
    function uniqueCustomers() {
        uniqueables().then((ls) => {
            console.log(ls);
            return;
            chunker({
                worker: updateUniques,
                list: ls,
            });
        });
    }
    return (
        <>
            <Menu.Item onClick={woker}>Customers</Menu.Item>
            <Menu.Item onClick={uniqueCustomers}>Unique Customers</Menu.Item>
        </>
    );
}
