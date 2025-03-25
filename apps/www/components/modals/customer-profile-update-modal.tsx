"use client";

import {
  _getSalesCustomerSystemData,
  GetSalesCustomerSystemData,
} from "@/actions/get-sales-customer-system-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Label } from "../ui/label";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxLabel,
  ComboboxTrigger,
} from "../ui/combobox";
import { CommandInput } from "../ui/command";
import { ChevronDown } from "lucide-react";

export default function CustomerProfileUpdateModal({ phoneNo, profileId }) {
  const [data, setData] = useState<GetSalesCustomerSystemData>(null);
  const [_profileId, setProfileId] = useState(profileId);
  useEffect(() => {
    console.log({ phoneNo, profileId });

    _getSalesCustomerSystemData(phoneNo, profileId).then((result) => {
      console.log({ result });

      setData(result);
    });
  }, [phoneNo, profileId]);
  useEffect(() => {}, [profileId]);
  const opened = data?.profileConflicts && profileId && phoneNo;
  if (!opened) return null;
  return null;
  return (
    <Dialog
      open={opened}
      onOpenChange={(e) => {
        setData(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Customer Profile</DialogTitle>
          <DialogDescription>{phoneNo}</DialogDescription>
        </DialogHeader>
        <div className="">
          <Table>
            <TableBody>
              {data.customers?.map((customer) => (
                <TableRow className="border-b" key={customer.id}>
                  <TableCell>
                    <p>{customer.name || customer.businessName}</p>
                    <Label>
                      {customer.profile?.title || "No Profile Attached"}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end">
          <Combobox value={_profileId} onValueChange={setProfileId}>
            <ComboboxLabel>Profile</ComboboxLabel>
            <ComboboxAnchor>
              <CommandInput placeholder="Select Profile..." />
              <ComboboxTrigger>
                <ChevronDown className="size-4" />
              </ComboboxTrigger>
            </ComboboxAnchor>
            <ComboboxContent>
              <ComboboxEmpty>No Profile Found</ComboboxEmpty>
              {data.profiles?.map((profile) => (
                <React.Fragment key={profile.id}>
                  {/* <ComboboxGroup>
                                        <ComboboxGroupLabel>
                                            Profiles
                                        </ComboboxGroupLabel> */}
                  <ComboboxItem value={String(profile.id)} outset>
                    {profile.title}
                  </ComboboxItem>
                  {/* </ComboboxGroup> */}
                </React.Fragment>
              ))}
            </ComboboxContent>
          </Combobox>
        </div>
      </DialogContent>
    </Dialog>
  );
}
