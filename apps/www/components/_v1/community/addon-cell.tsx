"use client";

import { IProject } from "@/types/community";
import { Cell } from "../columns/base-columns";
import Money from "../money";
import { Button } from "../../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useState, useTransition } from "react";
import { updateProjectMeta } from "@/app/(v1)/_actions/community/projects";
import Btn from "../btn";

interface Props {
    project: IProject;
}
export default function AddonCell({ project }: Props) {
    const [addon, setAddon] = useState({
        current: project.meta.addon,
        input: project.meta.addon,
    });
    const [isPending, startTransition] = useTransition();
    async function submit() {
        startTransition(async () => {
            await updateProjectMeta(project.id, {
                ...project.meta,
                addon: +addon.input,
            });
            setAddon({
                ...addon,
                current: addon.input,
            });
            setIsOpen(false);
        });
    }
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Cell>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="secondary"
                        className="flex h-8  data-[state=open]:bg-muted"
                    >
                        <span className="whitespace-nowrap">
                            {addon?.current > 0 ? (
                                <Money value={addon?.current} />
                            ) : (
                                "Add Addon"
                            )}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-[185px] p-4 grid gap-2"
                >
                    <div className="grid gap-2">
                        <Label>Addon</Label>
                        <Input
                            className="h-8"
                            value={addon?.input}
                            onChange={(e) => {
                                setAddon({
                                    ...addon,
                                    input: e.target.value,
                                });
                            }}
                            type="number"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Btn
                            isLoading={isPending}
                            onClick={submit}
                            className="h-8 p-1 px-2"
                        >
                            <span>Save</span>
                        </Btn>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </Cell>
    );
}
