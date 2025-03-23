"use client";

import * as React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/_v1/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { _useAsync } from "@/lib/use-async";
import { useRouter } from "next/navigation";
import FormInput from "@/components/common/controls/form-input";
import { RegisterSchema, registerSchema } from "./validation";
import { toast } from "sonner";
import { signupDealerAction } from "./action";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SignupForm({ className, ...props }: SignInFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>("");
    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });

    const [isPending, startTransition] = React.useTransition();

    const router = useRouter();
    async function onSubmit() {
        const data = form.getValues();

        startTransition(async () => {
            try {
                const resp = await signupDealerAction(data);
            } catch (error) {
                if (error instanceof Error) toast.error(error.message);
            }
        });
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormInput
                    size="sm"
                    control={form.control}
                    name="name"
                    label="Name"
                />
                <FormInput
                    size="sm"
                    control={form.control}
                    name="businessName"
                    label="Company Name"
                />
                <FormInput
                    size="sm"
                    control={form.control}
                    name="address"
                    label="Location"
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        size="sm"
                        control={form.control}
                        name="email"
                        label="Email"
                    />
                    <FormInput
                        size="sm"
                        control={form.control}
                        name="phoneNo"
                        label="Phone"
                        prefix="+1"
                    />

                    <FormInput
                        size="sm"
                        control={form.control}
                        name="state"
                        label="State"
                    />
                    <FormInput
                        size="sm"
                        control={form.control}
                        name="city"
                        label="City"
                    />
                </div>
                <Button disabled={isPending}>
                    {isPending && (
                        <Icons.spinner
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Submit
                    <span className="sr-only">Submit</span>
                </Button>
            </form>
        </Form>
    );
}
