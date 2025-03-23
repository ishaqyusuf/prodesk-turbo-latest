"use client";
import { Button } from "@/components/ui/button";
import { ISidebar } from "@/lib/navs";
import { cn, toSingular } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "../icons";
import { createContext, useContext, useState } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    nav: ISidebar;
    mobile?: Boolean;
}
export const NavContext = createContext<ReturnType<typeof useNavInit>>(
    {} as any
);
export const useNavCtx = () => useContext(NavContext);
function useNavInit() {
    const [show, toggle] = useState(false);
    return {
        show,
        toggle,
    };
}

export default function SiteNav({
    className,
    mobile,
    onClick,
    nav,
}: SidebarProps) {
    //   const [routes, setRoutes] = useState<any>([]);
    //   useEffect(() => {
    //       //     setRoutes(useSidebarRoutes(session));
    //   }, [session?.user?.id]);

    const pathname = usePathname();
    function RouteBtn(
        route: { icon: any; path: string; title: string; isNew?: boolean },
        i
    ) {
        const parentPath = toSingular(route.path);
        // console.log([parentPath, pathname]);

        const isActive = pathname.startsWith(route.path);
        // if (!isActive) {
        //     console.log({
        //         pathname,
        //         parentPath,
        //     });
        // }
        return (
            <Button
                key={i}
                asChild
                variant={isActive ? "outline" : "ghost"}
                size="sm"
                className={`w-full h-8 justify-start ${
                    isActive ? "bg-accent" : ""
                }`}
            >
                <Link onClick={onClick as any} href={route.path}>
                    {route.icon && <route.icon className="mr-2 h-4 w-4" />}
                    {route.title}
                    <div className="flex-1 flex justify-end">
                        {route.isNew && (
                            <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                                New
                            </span>
                        )}
                    </div>
                </Link>
            </Button>
        );
    }
    return (
        <aside className={cn(!mobile && "border-r pb-12", className)}>
            <div className="mx-4 mt-2">
                <Icons.logoLg />
            </div>
            <div className="py-4">
                {nav.routeGroup.map((route, index) => {
                    if (!route?.title || route?.routes?.length < 1)
                        return (
                            <div key={index} className="-mb-2 pt-2 px-4">
                                {route.routes?.map((cr, i) => RouteBtn(cr, i))}
                            </div>
                        );
                    return (
                        <div key={index} className="py-1s -mb-2 px-4 mt-4">
                            <h2 className="mb-2 pr-2 text-sm font-semibold tracking-tight text-muted-foreground">
                                {route.title}
                            </h2>
                            <div className="space-y-1s">
                                {route.routes?.map((cr, i) => RouteBtn(cr, i))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
