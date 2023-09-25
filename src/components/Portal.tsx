import { useRef, useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";

interface PortalProps {
  children: ReactNode;
  onClose: () => void;
}

export const Portal = (props: PortalProps) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#portal");
    setMounted(true);
  }, []);

  return mounted && ref.current
    ? createPortal(
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-[#202020A6] flex justify-center items-center p-8">
          <div className="relative ">
            <span
              onClick={props.onClose}
              className="absolute top-2 right-2 bg-[#999CBD] rounded-full text-white p-1 cursor-pointer"
            >
              <X size={28} />
            </span>
            {props.children}
          </div>
        </div>,
        ref.current
      )
    : null;
};
