import React, { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextInput(
  { type = "text", className = "", isFocused = false, placeholder = "", ...props },
  ref
) {
  const internalRef = useRef(null);
  const inputRef = ref || internalRef;

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused, inputRef]);

  return (
    <input
      type={type}
      ref={inputRef}
      placeholder={placeholder}
      className={[
        // Base: garis bawah biru soft
        "mt-2 block w-full appearance-none",
        "border-0 border-b-2 border-[#3b5998]/40",
        "bg-transparent text-gray-800 placeholder-gray-500",
        // Focus states → biru dominan
        "focus:outline-none focus:ring-0 focus:border-[#3b5998]",
        // Transitions
        "transition-all",
        // Disabled states
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
      {...props}
    />
  );
});
