"use client";

import { use } from "react";
import { GetDealersPageTabAction } from "./action";
import { FPageTabs } from "@/components/(clean-code)/fikr-ui/f-page-tabs";
import { Badge } from "@/components/ui/badge";

export default function PageTabsClient({ response }) {
    const tabs: GetDealersPageTabAction = use(response);
    return (
        <>
            <FPageTabs>
                {tabs.map((tab) => (
                    <FPageTabs.Tab
                        tabName={tab.title}
                        {...tab.params}
                        href={tab.url}
                        key={tab.title}
                    >
                        <span> {tab.title}</span>
                        <Badge className="px-2" variant="secondary">
                            {tab.count}
                        </Badge>
                    </FPageTabs.Tab>
                ))}
            </FPageTabs>
        </>
    );
}
