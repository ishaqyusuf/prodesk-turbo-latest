"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import SiteHeader from "@/components/_v1/layouts/site-header";
import { nav } from "@/lib/navs";
import SiteNav from "@/components/_v1/layouts/site-nav";
import Refresher from "@/components/_v1/refresher";

export default function AccountLayout({ children }: any) {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/login");
        },
    });

    if (!session?.user) return <></>;
    if (session.role?.name == "Dealer") redirect("/orders");
    let sb = nav(session);
    if (!sb) return;
    return (
        <>
            <div
                className={`${
                    !sb.noSideBar &&
                    "smd:grid-cols-[220px_minmax(0,1fr)]   lg:grid-cols-[240px_minmax(0,1fr)]"
                } lg:grid `}
            >
                {!sb.noSideBar && (
                    <SiteNav
                        nav={sb}
                        className="fixed top-0 z-30 -ml-2 hidden h-[calc(100vh)] w-full shrink-0 overflow-y-auto border-r lg:sticky lg:block"
                    />
                )}
                <main className="">
                    <SiteHeader nav={sb} />
                    <div
                        className={cn(
                            "relative py-4 lg:gap-10 2xl:grid 2xl:grid-cols-[1fr_300px] mb-16"
                        )}
                    >
                        <div className="mx-auto w-full min-w-0">{children}</div>
                    </div>
                </main>
            </div>
            <Refresher />
        </>
    );
}
