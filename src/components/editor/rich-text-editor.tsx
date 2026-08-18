"use client";

import { Tiptap, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Undo2,
  Redo2,
  Pilcrow,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-40",
        isActive && "bg-action/10 text-action hover:bg-action/15 hover:text-action",
      )}
    >
      {children}
    </button>
  );
}

/**
 * MS Word-style rich text editor built on Tiptap (React Composable API).
 * Supports headings (H1–H6), bold, italic, strike, lists, blockquote, code, and undo/redo.
 * Emits HTML via `onChange` — safe & consistent with Tiptap's document schema.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your instruction…",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p></p>",
    immediatelyRender: false, // SSR-safe (Next.js App Router)
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none min-h-[180px] px-3 py-2 text-sm text-foreground focus:outline-none",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="h-[240px] animate-pulse rounded-lg border border-border bg-muted/40" />
    );
  }

  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-background focus-within:border-action focus-within:ring-1 focus-within:ring-action",
        className,
      )}
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
        <ToolbarButton
          label="Paragraph"
          isActive={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 1"
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() => setHeading(1)}
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => setHeading(2)}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() => setHeading(3)}
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 4"
          isActive={editor.isActive("heading", { level: 4 })}
          onClick={() => setHeading(4)}
        >
          <Heading4 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 5"
          isActive={editor.isActive("heading", { level: 5 })}
          onClick={() => setHeading(5)}
        >
          <Heading5 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 6"
          isActive={editor.isActive("heading", { level: 6 })}
          onClick={() => setHeading(6)}
        >
          <Heading6 className="size-4" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-border" aria-hidden />

        <ToolbarButton
          label="Bold"
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-border" aria-hidden />

        <ToolbarButton
          label="Bullet list"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Ordered list"
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Blockquote"
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Code"
          isActive={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-4" />
        </ToolbarButton>

        <span className="mx-1 h-4 w-px bg-border" aria-hidden />

        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>

      {/* ── Editable area ── */}
      <div className="tiptap-wrap">
        <Tiptap editor={editor}>
          <Tiptap.Content />
        </Tiptap>
      </div>
    </div>
  );
}