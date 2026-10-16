import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MenuContent } from "./menu-content";

export const BurgerMenu = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("Header.menu");
  const closeMenu = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
        <button
          type="button"
          aria-label={t("closeMenu")}
          className="absolute right-3 top-4 block size-10 text-white"
          onClick={closeMenu}
        >
          <span className="relative block size-full fill-white">
            <Image src={"/icons/cross.svg"} fill alt="" />
          </span>
        </button>
      </div>
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className="bg-[rgba(255, 255, 255, 0.7)] fixed top-0 z-40 h-screen w-screen backdrop-blur"
        style={open ? { display: "block" } : { display: "none" }}
      ></div>
    </>
  );
};
