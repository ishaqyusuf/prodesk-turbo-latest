import { createContext, useContext, useEffect, useState } from "react";
import { NoteProps } from ".";
import { GetNotes, getNotesAction } from "./actions/get-notes-action";
import { SearchParamsType } from "@/components/(clean-code)/data-table/search-params";
import { NoteTagNames } from "./constants";

export const noteContext = createContext<ReturnType<typeof useNoteContext>>(
    null as any
);
export const NoteProvider = noteContext.Provider;
export const useNoteContext = (props: NoteProps) => {
    const [notes, setNotes] = useState<GetNotes>([]);
    useEffect(() => {
        const tagQuery: SearchParamsType = {};
        ["status", "type"].map((s) => {
            if (!props.tagFilters.find((a) => a.tagName == s))
                props.tagFilters.push({
                    tagName: s as any,
                    tagValue: "",
                });
        });
        props.tagFilters.map((f) => {
            if (f.tagName == "type" || f.tagName == "status") return;
            tagQuery[`note.${f.tagName}` as any] = f.tagValue;
        });
        console.log(tagQuery);
        getNotesAction(tagQuery).then((result) => {
            setNotes(
                result.filter((note) => {
                    let validations = [];

                    let status = note.tags.find(
                        (t) => t.tagName == "status"
                    )?.tagValue;
                    if (status)
                        validations.push(
                            props.statusFilters.includes(status as any)
                        );
                    let type = note.tags.find(
                        (t) => t.tagName == ("type" as NoteTagNames)
                    )?.tagValue;
                    console.log([type, status, validations]);
                    if (type)
                        validations.push(
                            props.typeFilters.includes(type as any)
                        );
                    return validations.every(Boolean);
                })
            );
        });
    }, []);
    return {
        notes,
        props,
        ...props,
        setNotes,
        deleteNote(id) {
            setNotes((prev) => {
                return [...prev].filter((a) => a.id != id);
            });
        },
    };
};
export const useNote = () => useContext(noteContext);
