"use client";

import { Icons } from "@/components/_v1/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    _dykeDoorsSvg,
    doorSvgsById,
    dykeDoorsSvg,
} from "@/lib/data/dyke-doors-svg";
import { uploadFile } from "@/lib/upload-file";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { toast } from "sonner";

export default function DoorSvgsPage() {
    const [doors, setDoors] = useState<typeof dykeDoorsSvg>([]);
    useEffect(() => {
        // console.log(doors);
        // let pattern = /^\d+-\d+[xX]\d+-\d+\s*/;
        // let _doors = dykeDoorsSvg.map((s, i) => {
        //     s.title = s.title.replace(pattern, "");
        //     s.id = (i + 1).toString();
        //     if (doorSvgsById[s.id]) s.url = null as any;
        //     return s;
        // });
        // _doors = doors.filter(
        //     (d, i) => doors.findIndex((_) => _.title == d.title) == i
        // );
        // console.log(_doors);
        setDoors(dykeDoorsSvg);
    }, [doors]);

    const [link, setLink] = useState("");
    const [uploadUrl, setUploadUrl] = useState<any>("");
    async function uploadLink() {
        if (!link) {
            toast.error("no link");
            return;
        }
        setUploadUrl(null);
        const u = await uploadFile(`https://edge.dykedoors.com${link}`, "dyke");
        setUploadUrl(u.secure_url);
        console.log(u.secure_url);
    }
    return (
        <div>
            <div className="fixed bg-white top-0 w-1/2 shadow-xl p-4">
                <div className="flex space-x-2">
                    <Input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <Button onClick={uploadLink}>Upload</Button>
                </div>
                <span>{uploadUrl}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {doors.map((d, i) => (
                    <Door {...d} key={i} index={i} setDoors={setDoors} />
                ))}
            </div>
        </div>
    );
}

function Door({ title, url: _url, id, index, setDoors }: any) {
    const [load, setLoad] = useState(false);
    const [url, setUrl] = useState(_url);
    const svg: any = doorSvgsById[id];
    function save() {
        const _svg = document.querySelectorAll(`div#door-${index} svg`);
        // console.log(svg);
        // setDoors((doors) => {
        //     let d = [
        //         ...doors.map((door, i) => {
        //             if (i == index) door.svg = _svg;
        //             return door;
        //         }),
        //     ];
        //     return d;
        // });
    }
    return (
        <div className={cn("border rounded-lg p-1")} id={`door-${index}`}>
            <div className="">{id}</div>
            {!svg || load ? (
                <>
                    {load ? (
                        <div className="relative">
                            <div className="absolute top-0 right-0 -m-4">
                                {load && (
                                    <Button
                                        onClick={save}
                                        className="w-8 h-8"
                                        size={"icon"}
                                    >
                                        <Icons.copy className="size-4" />
                                    </Button>
                                )}
                            </div>
                            <div id="object" className="">
                                <object data={url} type={"image/svg+xml"} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Button size={"sm"} onClick={(e) => setLoad(true)}>
                                Load
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <div className="absolute">
                        <Button
                            size={"sm"}
                            onClick={async (e) => {
                                setLoad(true);
                                console.log(url);
                                if (!url) {
                                    const nurl = _dykeDoorsSvg[id - 1]?.url;
                                    console.log(nurl);
                                    setUrl(nurl);
                                    const upload = await uploadFile(
                                        nurl,
                                        "dyke"
                                    );
                                    console.log(upload);
                                }

                                setLoad(true);
                            }}
                        >
                            Reload
                        </Button>
                    </div>
                    <SVG src={svg} />
                </div>
            )}
            <p className="text-xs">{title}</p>
        </div>
    );
}
