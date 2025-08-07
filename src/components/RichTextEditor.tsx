import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
  ),
});

import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your thoughts...",
  className = "",
  minHeight = 200,
}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "list",
    "bullet",
  ];

  return (
    <div className={`rich-editor ${className}`}>
      <style jsx global>{`
        .rich-editor .ql-editor {
          min-height: ${minHeight}px;
          font-size: 1rem;
          font-family: inherit;
          line-height: 1.625;
          color: inherit;
          background-color: transparent;
        }

        .rich-editor .ql-toolbar {
          border: 1px solid;
          border-color: #e2e8f0; /* light mode border */
          border-radius: 0.5rem 0.5rem 0 0;
        }

        .dark .rich-editor .ql-toolbar {
          border-color: #4b5563; /* dark mode border */
        }

        .rich-editor .ql-container {
          border: 1px solid;
          border-top: none;
          border-color: #e2e8f0;
          border-radius: 0 0 0.5rem 0.5rem;
        }

        .dark .rich-editor .ql-container {
          border-color: #4b5563;
        }

        .rich-editor .ql-editor:focus {
          outline: none;
        }

        /* Optional: Override Quill's light background */
        .rich-editor .ql-container.ql-snow {
          background-color: transparent;
        }

        .rich-editor .ql-toolbar.ql-snow {
          background-color: transparent;
        }

        .dark .rich-editor .ql-toolbar.ql-snow {
          background-color: transparent;
        }

        .dark .rich-editor .ql-container.ql-snow {
          background-color: transparent;
        }

        /* Optional: Style buttons to match theme better */
        .rich-editor .ql-snow .ql-stroke {
          stroke: currentColor;
        }

        .rich-editor .ql-snow .ql-fill {
          fill: currentColor;
        }

        .rich-editor .ql-snow .ql-picker {
          color: inherit;
        }
      `}</style>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};
