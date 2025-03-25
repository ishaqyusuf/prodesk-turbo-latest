import { searchParamsCache } from "@/components/(clean-code)/data-table/search-params";
import OrdersPageClient from "../../_components/orders-page-client";

import FPage from "@/components/(clean-code)/fikr-ui/f-page";
import { __isProd } from "@/lib/is-prod-server";
import { getQueryClient } from "@/providers/get-query-client";
import { dataOptions } from "@/components/(clean-code)/data-table/query-options";

import { getSalesPageQueryDataDta } from "../../../../_common/data-access/sales-page-query-data";
import { composeFilter } from "@/components/(clean-code)/data-table/filter-command/filters";
import { constructMetadata } from "@/lib/(clean-code)/construct-metadata";
import Portal from "@/components/_v1/portal";
import NewFeatureBtn from "@/components/common/new-feature-btn";
import { prisma } from "@/db";
import TablePage from "@/components/tables/table-page";

export async function generateMetadata({}) {
  return constructMetadata({
    title: `Sales List - gndprodesk.com`,
  });
}
export default async function SalesBookPage({ searchParams }) {
  // // const del = await prisma.salesStat.deleteMany({});
  // // console.log(del);

  // const search = searchParamsCache.parse(searchParams);
  // const queryClient = getQueryClient();
  // const props = composeFilter("orders", await getSalesPageQueryDataDta());
  // const { queryKey, filterFields } = props;
  // await queryClient.prefetchInfiniteQuery(dataOptions(search, queryKey));
  return (
    <FPage can={["viewOrders"]} title="Orders">
      <Portal nodeId={"navRightSlot"}>
        <NewFeatureBtn href="/sales/orders">Old Site</NewFeatureBtn>
      </Portal>
      <TablePage
        PageClient={OrdersPageClient}
        searchParams={searchParams}
        filterKey="orders"
      />
    </FPage>
  );
}
