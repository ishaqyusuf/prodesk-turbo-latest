"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { getTerminalPaymentStatus } from "@/modules/square";

const schema = z.object({
  checkoutId: z.string(),
  squarePaymentId: z.string(),
});

export const getTerminalPaymentStatusAction = actionClient
  .schema(schema)
  .metadata({
    name: "get-terminal-payment-status",
  })
  .action(async ({ parsedInput: { checkoutId, squarePaymentId } }) => {
    const { status, tip } = await getTerminalPaymentStatus(checkoutId);
    return { status, tip };
  });
