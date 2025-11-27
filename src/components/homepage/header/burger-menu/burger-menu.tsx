import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { MenuContent } from "./menu-content";

export const BurgerMenu = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const layerRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    const currentLayer = layerRef.current;

    if (currentLayer) {
      currentLayer.addEventListener("click", closeMenu);
    }

    if (open) {
      document.body.style.overflow = "hidden";
      currentLayer?.addEventListener("click", closeMenu);
    } else {
      document.body.style.overflowY = "auto";
    }

    return () => {
      if (currentLayer) {
        currentLayer.removeEventListener("click", closeMenu);
      }
    };
  }, [open, closeMenu]);

  // useEffect(() => {
  //   const currentLayer = layerRef.current;
  //   if (open) {
  //     document.body.style.overflow = "hidden";
  //     currentLayer?.addEventListener("click", closeMenu);
  //   } else {
  //     document.body.style.overflowY = "auto";
  //   }
  //   return () => {
  //     document.body.style.overflowY = "auto";
  //     currentLayer?.removeEventListener("click", closeMenu);
  //   };
  // }, [open, closeMenu]);

  return (
    <>
      <div
        className="absolute top-0 z-50 block h-screen w-full bg-blue-900 transition-all duration-300 ease-out ms:w-[70%] md:w-[50%] lg:hidden"
        style={
          open
            ? { transform: "translateX(0)", opacity: 1 }
            : { transform: "translateX(-100%)", opacity: 0 }
        }
      >
        <MenuContent closeMenu={closeMenu} />
        <span
          className="absolute right-3 top-4 block size-10 text-white"
          onClick={closeMenu}
        >
          <div className="relative size-full fill-white">
            <Image src={"/icons/cross.svg"} fill alt="cross" />
          </div>
        </span>
      </div>
      <div
        ref={layerRef}
        className="bg-[rgba(255, 255, 255, 0.7)] fixed top-0 z-40 h-screen w-screen backdrop-blur"
        style={open ? { display: "block" } : { display: "none" }}
      ></div>
    </>
  );
};
