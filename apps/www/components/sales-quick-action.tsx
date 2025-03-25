"use client";

import { Menu } from "./(clean-code)/menu";
import Portal from "./_v1/portal";

export function SalesQuickAction({}) {
  return (
    <Portal nodeId={"navRightSlot"}>
      <Menu label={"Quick Action"}>
        <Menu.Item href={`/sales-book/create-order`}>New Sales</Menu.Item>
        <Menu.Item href={`/sales-book/create-quote`}>New Quote</Menu.Item>
      </Menu>
    </Portal>
  );
}
