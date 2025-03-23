import { CustomerProfileTaxUpdatePrompt } from "@/components/forms/sales-form/customer-profile-tax-update-prompt";
import { SalesFormFeatureSwitch } from "@/components/sales-form-feature-switch";

export default function Layout({ children }) {
    return (
        <>
            <SalesFormFeatureSwitch />
            <CustomerProfileTaxUpdatePrompt />
            {children}
        </>
    );
}
