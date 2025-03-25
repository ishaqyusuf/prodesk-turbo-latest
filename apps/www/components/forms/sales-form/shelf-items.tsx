"use client";

import {
  Combobox,
  ComboboxAnchor,
  ComboboxBadgeItem,
  ComboboxBadgeList,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { _useAsync } from "@/lib/use-async";
import { ChevronDown } from "lucide-react";
import React, { useDeferredValue, useEffect, useState } from "react";
import { useFormDataStore } from "@/app/(clean-code)/(sales)/sales-book/(form)/_common/_stores/form-data-store";
import Button from "@/components/common/button";
import { Icons } from "@/components/_v1/icons";
import { ShelfContext, useShelfContext, useShelf } from "@/hooks/use-shelf";
import {
  ShelfItemContext,
  useShelfItemContext,
  useShelfItem,
} from "@/hooks/use-shelf-item";
import ConfirmBtn from "@/components/_v1/confirm-btn";
import { ShelfQtyInput } from "./shelf-qty-input";
import { AnimatedNumber } from "@/components/animated-number";
import { ShelfPriceCell } from "./shelf-price-cell";
import { ClearCategoryModal } from "./clear-category";

export function ShelfItems({ itemStepUid }) {
  const ctx = useShelfContext(itemStepUid);
  return (
    <ShelfContext.Provider value={ctx}>
      <div className="">
        <Table className="size-sm">
          <TableBody>
            {ctx.shelfItemUids?.map((uid, index) => (
              <ShelfItemLine
                index={index}
                key={uid}
                shelfUid={uid}
                isLast={ctx.shelfItemUids?.length - 1 == index}
              />
            ))}
          </TableBody>
        </Table>
        <div className="border-t p-4  w-full">
          <Button
            onClick={() => {
              ctx.newSection();
            }}
            className=""
            size="xs"
          >
            <Icons.add className="size-4" />
            Item Section
          </Button>
        </div>
      </div>
    </ShelfContext.Provider>
  );
}
export function ShelfItemLine({ shelfUid, index, isLast }) {
  const zus = useFormDataStore();
  const { itemUid, categories } = useShelf();
  const ctx = useShelfItemContext({ shelfUid });
  const { categoryIds, setCategoryIds, filteredTricks, inputValue } = ctx;
  // const [categoryIds, setCategoryIds] = React.useState<string[]>([]);
  const [open, onOpenChange] = useState(false);
  const [openClearCat, setOpenClearCat] = useState(false);
  function _clearCats() {}
  function clearCategory(e) {
    e.preventDefault();
    const selection = Object.values(ctx.products)?.filter(
      (a) => a?.productId,
    )?.length;
    if (selection > 0) {
      setOpenClearCat(true);
    } else {
      ctx.dotUpdateShelf("categoryIds", []);
    }
  }
  return (
    <ShelfItemContext.Provider value={ctx}>
      <TableRow className="hover:bg-transparent">
        <ClearCategoryModal
          onClear={_clearCats}
          open={openClearCat}
          openChange={setOpenClearCat}
        />
        <TableCell className="flex flex-col">
          <Table>
            {index > 0 || (
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              <TableRow>
                <TableCell>
                  <Combobox
                    open={open}
                    onOpenChange={onOpenChange}
                    value={categoryIds.map((id) => String(id))}
                    onValueChange={setCategoryIds}
                    multiple
                    inputValue={inputValue}
                    onInputValueChange={ctx.onInputValueChange}
                    manualFiltering
                    className="w-full"
                    autoHighlight
                  >
                    <ComboboxAnchor className="h-full min-h-10 flex-wrap px-3 py-2">
                      <ComboboxBadgeList>
                        {categoryIds.map((item, index) => {
                          const option = categories?.find(
                            (trick) => trick.id === Number(item),
                          );
                          if (!option) return null;

                          return (
                            <ComboboxBadgeItem
                              noDelete={!(categoryIds?.length - 1 == index)}
                              onDelete={(e) => {
                                // e.preventDefault();
                                // console.log(e);
                              }}
                              key={item}
                              value={String(item)}
                            >
                              {option.name}
                            </ComboboxBadgeItem>
                          );
                        })}
                        {categoryIds?.length < 1 || (
                          <ComboboxBadgeItem
                            className=""
                            value="clear"
                            onDelete={clearCategory}
                          >
                            Clear
                          </ComboboxBadgeItem>
                        )}
                      </ComboboxBadgeList>
                      {!ctx?.options?.length || (
                        <>
                          <ComboboxInput
                            className="h-auto min-w-20 flex-1"
                            onFocus={(e) => {
                              onOpenChange(true);
                            }}
                            placeholder="Select category..."
                          />
                          <ComboboxTrigger className="absolute top-3 right-2">
                            <ChevronDown className="h-4 w-4" />
                          </ComboboxTrigger>
                        </>
                      )}
                    </ComboboxAnchor>

                    {!ctx.options?.length || (
                      <ComboboxContent
                        ref={(node) => ctx?.setContent(node)}
                        className="relative max-h-[300px] overflow-y-auto overflow-x-hidden"
                      >
                        <ComboboxEmpty>No category found</ComboboxEmpty>
                        {filteredTricks?.map((trick) => (
                          <ComboboxItem
                            key={String(trick.id)}
                            value={String(trick.id)}
                            outset
                          >
                            {trick.name}
                          </ComboboxItem>
                        ))}
                      </ComboboxContent>
                    )}
                  </Combobox>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableCell>
        <TableCell className="w-[70%] p-0">
          <div className="flex flex-col">
            <Table className="">
              {index > 0 || (
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead align="right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
              )}
              <TableBody>
                {ctx.productUids?.map((puid, puidIndex) => (
                  <ShelfItemProduct
                    isLast={isLast && ctx.productUids?.length - 1 == puidIndex}
                    prodUid={puid}
                    key={puid}
                  />
                ))}

                <TableRow>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          ctx.addProduct();
                        }}
                      >
                        <Icons.add className="size-4" />
                        Add Product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TableCell>
      </TableRow>
    </ShelfItemContext.Provider>
  );
}
function ShelfItemProduct({ prodUid, isLast }) {
  const itemCtx = useShelfItem();
  const shelf = useShelf();
  const { productsList: products } = itemCtx;
  const product = itemCtx.products?.[prodUid];
  const { basePrice, salesPrice, qty, customPrice } = product || {};
  useEffect(() => {
    let _salesPrice = Number.isInteger(customPrice)
      ? customPrice
      : salesPrice || 0;
    let totalPrice = qty * _salesPrice;
    // itemCtx.dotUpdateProduct(prodUid, "totalPrice", totalPrice);
    shelf.costCls.updateShelfCosts(shelf.itemUid);
  }, [basePrice, qty, customPrice, prodUid]);
  const [open, onOpenChange] = useState(false);
  const [inputValue, setInputValue] = React.useState(product?.title || "");
  const deferredInputValue = useDeferredValue(inputValue);
  const [isTyping, setIsTyping] = useState(false);
  const filteredProducts = React.useMemo(() => {
    if (!deferredInputValue || !isTyping) return products?.products;
    const normalized = deferredInputValue.toLowerCase();
    const __products = products?.products?.filter((item) =>
      item.title.toLowerCase().includes(normalized),
    );
    return __products;
  }, [deferredInputValue, products, isTyping]);
  const [content, setContent] = React.useState<React.ComponentRef<
    typeof ComboboxContent
  > | null>(null);
  const onInputValueChange = React.useCallback(
    (value: string) => {
      setInputValue(value);
      if (content) {
        content.scrollTop = 0; // Reset scroll position
        //  virtualizer.measure();
      }
    },
    [content],
  );

  return (
    <TableRow className="w-2/3 hover:bg-transparent">
      <TableCell>
        <Combobox
          open={open}
          onOpenChange={onOpenChange}
          value={String(product?.productId)}
          onValueChange={(e) => {
            itemCtx.productChanged(prodUid, e);
            setTimeout(() => {
              if (e) onOpenChange(false);
            }, 100);
          }}
          inputValue={inputValue}
          onInputValueChange={onInputValueChange}
          manualFiltering
          className="w-full"
          autoHighlight
        >
          <ComboboxAnchor className="h-full min-h-10 flex-wrap px-3 py-2 relative">
            <ComboboxInput
              className="h-auto min-w-20 flex-1 "
              onFocus={(e) => {
                onOpenChange(true);
                setIsTyping(false);
              }}
              onBlur={() => {
                setIsTyping(false);
              }}
              onKeyDown={(e) => {
                setIsTyping(true);
              }}
              placeholder="Select product..."
            />
            {!product?.productId || (
              <ComboboxTrigger
                onClick={(e) => {
                  e.preventDefault();
                  setInputValue("");
                  itemCtx.clearProduct(prodUid);
                }}
                className="absolute top-3 right-2"
              >
                <Icons.X className="h-4 w-4" />
              </ComboboxTrigger>
            )}
          </ComboboxAnchor>

          <ComboboxContent
            ref={(node) => setContent(node)}
            className="relative max-h-[300px] overflow-y-auto overflow-x-hidden"
          >
            <ComboboxEmpty>No product found</ComboboxEmpty>
            {filteredProducts?.map((trick) => (
              <ComboboxItem
                key={String(trick.id)}
                value={String(trick.id)}
                outset
              >
                {trick.title}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
      </TableCell>
      <TableCell className="w-24">
        <ShelfPriceCell prodUid={prodUid} product={product} />
      </TableCell>
      <TableCell className="w-16">
        <ShelfQtyInput prodUid={prodUid} value={product?.qty} />
      </TableCell>
      <TableCell className="w-24 relative">
        <AnimatedNumber value={product?.totalPrice || 0} />
        {/* {!isLast || <Footer />} */}
      </TableCell>
      <TableCell className="w-24">
        <ConfirmBtn
          trash
          onClick={() => {
            itemCtx.deleteProductLine(prodUid);
          }}
        />
      </TableCell>
    </TableRow>
  );
}
function Footer() {
  return (
    <div className="absolute">
      <AnimatedNumber value={100} />
    </div>
  );
}
