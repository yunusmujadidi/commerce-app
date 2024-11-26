"use client";

import { Image as ImageType } from "@prisma/client";
import Image from "next/image";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { cn } from "@/lib/utils";

export const Gallery = ({ images }: { images: ImageType[] }) => {
  return (
    <TabGroup as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <TabList className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <Tab
              key={image.id}
              className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white"
            >
              {({ selected }) => (
                <div>
                  <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
                    <Image
                      fill
                      src={image.url}
                      alt=""
                      className="object-cover object-center"
                    />
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 rounded-md ring-2 ring-offset-2",
                      selected ? "ring-black" : "ring-transparent"
                    )}
                  />
                </div>
              )}
            </Tab>
          ))}
        </TabList>
      </div>
      <TabPanels className="aspect-square w-full">
        {images.map((image) => (
          <TabPanel key={image.id}>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
              <Image
                fill
                src={image.url}
                alt="Image"
                className="object-cover object-center"
              ></Image>
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};
