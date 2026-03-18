import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function pad2(n) {
    return String(n).padStart(2, "0");
}

function toISODateString(date) {
    if (!date) return "";
    // Use local date parts to avoid timezone shifting.
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
        date.getDate(),
    )}`;
}

function fromISODateString(value) {
    if (!value) return undefined;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!m) return undefined;
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    const d = new Date(year, month, day);
    return Number.isNaN(d.getTime()) ? undefined : d;
}

export default function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
}) {
    const selected = useMemo(() => fromISODateString(value), [value]);
    const [open, setOpen] = useState(false);
    const [portalStyle, setPortalStyle] = useState({});
    const wrapperRef = useRef(null);
    const portalRef = useRef(null);

    useEffect(() => {
        const portal = document.createElement("div");
        portalRef.current = portal;
        document.body.appendChild(portal);

        return () => {
            if (portalRef.current) {
                document.body.removeChild(portalRef.current);
                portalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const onDocMouseDown = (e) => {
            if (
                !wrapperRef.current ||
                !portalRef.current ||
                wrapperRef.current.contains(e.target) ||
                portalRef.current.contains(e.target)
            ) {
                return;
            }
            setOpen(false);
        };

        const onEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onDocMouseDown);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDocMouseDown);
            document.removeEventListener("keydown", onEsc);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        if (!wrapperRef.current) return;

        const updatePortalPosition = () => {
            if (!wrapperRef.current) return;
            const rect = wrapperRef.current.getBoundingClientRect();
            const maxWidth = Math.min(360, window.innerWidth - 32);

            setPortalStyle({
                position: "absolute",
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                width: `${maxWidth}px`,
            });
        };

        updatePortalPosition();

        window.addEventListener("resize", updatePortalPosition);
        window.addEventListener("scroll", updatePortalPosition, {
            passive: true,
        });

        return () => {
            window.removeEventListener("resize", updatePortalPosition);
            window.removeEventListener("scroll", updatePortalPosition);
        };
    }, [open]);
    const displayValue = selected
        ? selected.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "";

    return (
        <div ref={wrapperRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={[
                    "input text-left",
                    "flex items-center justify-between gap-3",
                    !displayValue ? "text-ink-400" : "text-ink-950",
                ].join(" ")}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                <span className="truncate">{displayValue || placeholder}</span>
                <span className="flex items-center gap-2">
                    {value ? (
                        <span
                            className="btn-soft px-3 py-1.5 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                        >
                            Clear
                        </span>
                    ) : null}
                    <span className="text-primary-700">📅</span>
                </span>
            </button>

            {open && portalRef.current
                ? createPortal(
                      <div
                          style={portalStyle}
                          className="datepicker-portal rounded-3xl bg-white/55 p-3 shadow-lift backdrop-blur-xl ring-1 ring-white/60"
                      >
                          <div
                              className="w-full"
                              style={{
                                  // DayPicker uses CSS variables; adjusting these keeps the month grid behavior intact.
                                  "--rdp-accent-color": "#5a4ef1", // primary-600
                                  "--rdp-accent-background-color": "#eceeff", // primary-100
                                  "--rdp-day_button-border-radius": "14px",
                                  "--rdp-nav-height": "2.75rem",
                              }}
                          >
                              <div className="flex justify-center">
                                  <DayPicker
                                      mode="single"
                                      selected={selected}
                                      onSelect={(d) => {
                                          onChange(toISODateString(d));
                                          setOpen(false);
                                      }}
                                      captionLayout="dropdown"
                                      numberOfMonths={1}
                                  />
                              </div>

                              <div className="mt-2 flex items-center justify-between px-2">
                                  <button
                                      type="button"
                                      className="btn-soft px-5 py-2.5"
                                      onClick={() => {
                                          onChange(toISODateString(new Date()));
                                          setOpen(false);
                                      }}
                                  >
                                      Today
                                  </button>
                                  <button
                                      type="button"
                                      className="btn-soft px-5 py-2.5"
                                      onClick={() => setOpen(false)}
                                  >
                                      Close
                                  </button>
                              </div>
                          </div>
                      </div>,
                      portalRef.current,
                  )
                : null}
        </div>
    );
}
