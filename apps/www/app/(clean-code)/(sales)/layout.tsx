import { ContentLayout } from "../../../components/(clean-code)/content-layout";
import SidebarLayout from "../../../components/(clean-code)/side-bar-layout";
import BackwardCompat from "./_backward-compat";
import { CustomerOverviewSheet } from "@/components/sheets/customer-overview-sheet";
import { SalesPreviewModal } from "@/components/modals/sales-preview-modal";
import { SalesQuickAction } from "@/components/sales-quick-action";

import SalesOverviewSheet from "@/components/sheets/sales-overview-sheet";
import { CustomerCreateSheet } from "@/components/sheets/customer-create-sheet";

export default async function Layout({ children }) {
  // await fixPaymentMethod();
  return (
    <SidebarLayout>
      <ContentLayout>
        <SalesQuickAction />
        <BackwardCompat />
        {children}
      </ContentLayout>
      <CustomerOverviewSheet />
      <SalesPreviewModal />
      <SalesOverviewSheet />
      <CustomerCreateSheet />
    </SidebarLayout>
  );
}
