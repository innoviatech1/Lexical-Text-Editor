import { Button } from "./ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
// import { RichTextAction } from "constants";
import { useState } from "react"
import { BsPlus } from "react-icons/bs";
import { HiChevronDown } from "react-icons/hi2";

// interface Props {
//   onAction: (id: RichTextAction) => void,
//   selectionMap: {
//     [id: string]: boolean;
//   }
// }
export function InsertDropdownList({ }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover open={isOpen} onOpenChange={(s) => setIsOpen(s)}>
      <PopoverTrigger asChild>
        <Button variant={isOpen ? "toolbarActive" : "toolbar"}
          onClick={() => setIsOpen(!isOpen)} size="icon" className="size-10 w-fit p-2 select-none border-[1px] border-gray-100"
        >
          <BsPlus /> <span>Insert</span> <HiChevronDown className={` transition-normal duration-100 ${isOpen ? "rotate-180" : "rotate-0"}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-fit flex flex-col items-start gap-1">



      </PopoverContent>
    </Popover>
  )
}
