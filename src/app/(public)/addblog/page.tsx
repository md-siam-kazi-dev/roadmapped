"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, PenSquare } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { apiFetch } from "@/lib/api/api-fetch";

export default function AddBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const submit = async (status: "PUBLISHED" | "DRAFT") => {
    const payload = {
      title,
      content: content || "<p></p>",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status,
    };

    if (status === "PUBLISHED") setIsPublishing(true);
    else setIsSavingDraft(true);

    try {
      await apiFetch("/user/addblog", payload);
      toast.success(
        status === "PUBLISHED"
          ? "Blog post published successfully."
          : "Blog post saved as draft.",
      );
      router.push("/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save the blog post.");
    } finally {
      setIsPublishing(false);
      setIsSavingDraft(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a blog title.");
      return;
    }
    void submit("PUBLISHED");
  };

  const handleSaveDraft = () => {
    void submit("DRAFT");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
        <Link href="/blog">
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Write a Blog Post
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Share your learning experience, tips, or resources with the community.
        </p>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="blog-title">Title</Label>
          <Input
            id="blog-title"
            type="text"
            placeholder="e.g. How I Completed 30 Days of Frontend"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-surface"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-content">Content</Label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your blog post here - use the toolbar for headings, bold, italic, lists, quotes, and more..."
          />
          <p className="text-xs text-muted-foreground">
            Rich text supported - headings, bold, italic, lists, quotes, and code.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-tags">Tags (comma separated)</Label>
          <Input
            id="blog-tags"
            type="text"
            placeholder="e.g. nextjs, typescript, tutorial"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-surface"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isPublishing || isSavingDraft}
            className="bg-action text-white hover:bg-action-hover"
          >
            {isPublishing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <PenSquare className="size-4" />
                Publish Post
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPublishing || isSavingDraft}
            onClick={handleSaveDraft}
          >
            {isSavingDraft ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving draft...
              </>
            ) : (
              "Save as Draft"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}