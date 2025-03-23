"use server";

import { prisma } from "@/db";
import { actionClient } from "./safe-action";
import { createCustomerSchema } from "./schema";
import {
    AddressBookMeta,
    CustomerMeta,
} from "@/app/(clean-code)/(sales)/types";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { Tags } from "@/utils/constants";

export const createCustomerAction = actionClient
    .schema(createCustomerSchema)
    .metadata({
        name: "create-customer",
        track: {},
    })
    .action(async ({ parsedInput: { ...input } }) => {
        let customerId = input.id;
        const customerData = {
            name: input.name,
            phoneNo: input.phoneNo,
            phoneNo2: input.phoneNo2,
            email: input.email,
            address: input.address1,
            businessName: input.businessName,
            meta: {
                netTerm: input.netTerm,
            } satisfies CustomerMeta,
            profile: {
                connect: {
                    id: Number(input.profileId),
                },
            },
            taxProfiles: input?.taxProfileId
                ? input?.taxCode
                    ? {
                          update: {
                              where: {
                                  id: Number(input.taxProfileId),
                              },
                              data: {
                                  taxCode: input.taxCode,
                              },
                          },
                      }
                    : undefined
                : input?.taxCode
                ? {
                      create: {
                          taxCode: input.taxCode,
                      },
                  }
                : undefined,
        } satisfies Prisma.CustomersUpdateInput;
        if (input.id) {
            const customer = await prisma.customers.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...customerData,
                },
            });
        } else {
            const customer = await prisma.customers.create({
                data: {
                    ...customerData,
                },
            });
            customerId = customer.id;
        }
        const addressData = {
            address1: input.address1,
            address2: input.address2,
            phoneNo2: input.phoneNo2,
            phoneNo: input.phoneNo,
            country: input.country,
            state: input.state,
            city: input.city,
            isPrimary: true,
            meta: {
                zip_code: input.zip_code,
            } satisfies AddressBookMeta,
        } satisfies Prisma.AddressBooksUpdateInput;
        if (input.taxProfileId && !input.taxCode)
            await prisma.customerTaxProfiles.update({
                where: {
                    id: Number(input.taxProfileId),
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        const address = input.addressId
            ? await prisma.addressBooks.upsert({
                  where: {
                      id: input.addressId,
                      isPrimary: true,
                  },
                  create: {
                      ...addressData,
                      customerId,
                  },
                  update: addressData,
              })
            : await prisma.addressBooks.create({
                  data: {
                      ...addressData,
                      customerId,
                      isPrimary: true,
                  },
              });
        revalidateTag(Tags.salesCustomers);
        return {
            customerId,
            addressId: address.id,
        };
    });
