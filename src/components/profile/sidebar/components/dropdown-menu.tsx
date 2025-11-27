import Link from "next/link";

interface DropdownMenuProps {
  isOpen: boolean;
  toggle: (value: boolean) => void;
  lng: string;
}

export const DropdownMenu = ({ isOpen, toggle, lng }: DropdownMenuProps) => {
  return (
    <div
      className={`absolute left-full top-0 w-64 rounded-[8px] bg-white p-2 shadow-lg transition-all ${
        isOpen ? "block" : "hidden"
      }`}
      onMouseEnter={() => toggle(true)}
      onMouseLeave={() => toggle(false)}
      onClick={() => toggle(false)}
    >
      <ul>
        <li className="rounded-[8px] px-[26px] py-3 text-black-500 hover:bg-blue-50 hover:text-blue-500">
          <Link href="resume">{lng === "en" ? "My resume" : "Мої резюме"}</Link>
        </li>
        <li className="rounded-[8px] px-[26px] py-3 text-black-500 hover:bg-blue-50 hover:text-blue-500">
          <Link href="cover-letter">
            {lng === "en" ? "My cover-letters" : "Мої супровідні листи"}
          </Link>
        </li>
      </ul>
    </div>
  );
};
