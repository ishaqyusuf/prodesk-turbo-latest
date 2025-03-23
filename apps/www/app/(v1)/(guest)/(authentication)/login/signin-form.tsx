"use client";

import * as React from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/_v1/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { _useAsync } from "@/lib/use-async";
import { redirect, useRouter } from "next/navigation";
import { ILogin, loginSchema } from "@/lib/validations/auth";
import { PasswordInput } from "../../../../../components/_v1/password-input";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: SignInFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<any>("");
    const form = useForm<ILogin>({
        resolver: zodResolver(loginSchema),
    });
    const { data: session } = useSession();

    const [isPending, startTransition] = React.useTransition();
    const { register, handleSubmit } = form;
    const router = useRouter();
    async function onSubmit(loginData: ILogin) {
        startTransition(async () => {
            setError(null);
            // console.log(await loginAction(loginData));
            await signIn("credentials", {
                ...loginData,
                callbackUrl: "/",
                redirect: true,
            });
        });
    }
    React.useEffect(() => {
        console.log(">>>>>");

        if (session?.user?.id) {
            console.log(session?.user);
            redirect("/");
        }
    }, [session]);
    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) =>
                    void form.handleSubmit(onSubmit)(...args)
                }
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="**********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isPending}>
                    {isPending && (
                        <Icons.spinner
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Sign in
                    <span className="sr-only">Sign in</span>
                </Button>
            </form>
        </Form>
    );
    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-2">
                        <Label className="" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            {...register("email")}
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="mt-2" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            {...register("password")}
                            placeholder="password"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Button className="mt-2" disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In
                        <span className="sr-only">Sign in</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
