"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, ListVideo, HelpCircle, Loader2, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { apiFetch } from "@/lib/api/api-fetch";

interface VideoContent {
  videoTopic: string;
  videoLink: string;
}

interface QuizQuestion {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
}

export default function EditModulePage() {
  const params = useParams<{ courseId: string; moduleNumber: string }>();
  const router = useRouter();
  const courseId = params.courseId;
  const moduleNumber = params.moduleNumber;

  const [moduleTitle, setModuleTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("1");
  const [videos, setVideos] = useState<VideoContent[]>([
    { videoTopic: "", videoLink: "" },
  ]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* ---- video content rows ---- */
  const updateVideo = (index: number, key: keyof VideoContent, value: string) => {
    setVideos((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    );
  };

  const addVideo = () => {
    setVideos((prev) => [...prev, { videoTopic: "", videoLink: "" }]);
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  /* ---- quiz builder ---- */
  const updateQuiz = (index: number, key: keyof QuizQuestion, value: string) => {
    setQuizzes((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [key]: value } : q)),
    );
  };

  const addQuiz = () => {
    setQuizzes((prev) => [
      ...prev,
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: "",
      },
    ]);
  };

  const removeQuiz = (index: number) => {
    setQuizzes((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---- validation ---- */
  const validateModule = (): string | null => {
    // Video title + video link are required for each video row.
    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      if (!v.videoTopic.trim()) {
        return `Video title is required for content ${i + 1}.`;
      }
      if (!v.videoLink.trim()) {
        return `Video URL is required for content ${i + 1}.`;
      }
    }

    // Quiz question, all 4 options, and answer are required for each quiz row.
    for (let i = 0; i < quizzes.length; i++) {
      const q = quizzes[i];
      if (!q.question.trim()) return `Question ${i + 1} is required.`;
      if (!q.option1.trim()) return `Option 1 is required for question ${i + 1}.`;
      if (!q.option2.trim()) return `Option 2 is required for question ${i + 1}.`;
      if (!q.option3.trim()) return `Option 3 is required for question ${i + 1}.`;
      if (!q.option4.trim()) return `Option 4 is required for question ${i + 1}.`;
      if (!q.answer.trim()) return `Correct answer is required for question ${i + 1}.`;
    }

    return null;
  };

  /* ---- submit in the requested format ---- */
  const saveModule = async () => {
    const invalid = validateModule();
    if (invalid) {
      toast.error(invalid);
      return;
    }

    const moduleMap: Record<number, VideoContent> = {};
    videos.forEach((v, i) => {
      moduleMap[i + 1] = { videoTopic: v.videoTopic, videoLink: v.videoLink };
    });

    const quizMap: Record<number, QuizQuestion> = {};
    quizzes.forEach((q, i) => {
      quizMap[i + 1] = {
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        answer: q.answer,
      };
    });

    const payload = {
      courseId,
      moduleNumber: Number(moduleNumber),
      title: moduleTitle,
      text: instruction,
      totalVideo: videos.filter((v) => v.videoTopic.trim() && v.videoLink.trim()).length,
      deadlineTime: deadlineTime ? Number(deadlineTime) : 1,
      module: moduleMap,
      quiz: quizMap,
    };

    try {
      setIsSaving(true);
      await apiFetch("/user/addmodule", payload);
      toast.success("Module content saved successfully.");
      // Redirect back to the course editor on success.
      router.push(`/mycourse/${courseId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save module.");
      setConfirmOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
        <Link href={`/mycourse/${courseId}`}>
          <ArrowLeft className="size-4" />
          Back to Course
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Edit Module {moduleNumber}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add video content, quiz questions, and a deadline for this module.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Module details + instruction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Module Details</CardTitle>
            <CardDescription className="text-xs">
              Module title, instruction, and deadline for learners.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="module-title">Module Title</Label>
              <Input
                id="module-title"
                placeholder="e.g. Introduction to Tailwind CSS"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instruction">
                Instruction{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <RichTextEditor
                value={instruction}
                onChange={setInstruction}
                placeholder="Write the instruction for this module — use the toolbar for headings, bold, italic, lists, and more…"
              />
              <p className="text-xs text-muted-foreground">
                Rich text supported — headings, bold, italic, lists, quotes, and code.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline-time">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  Deadline (days)
                </span>
              </Label>
              <Input
                id="deadline-time"
                type="number"
                min={1}
                placeholder="e.g. 1"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                How many days learners have to complete this module before the deadline.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Video content rows */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <ListVideo className="size-5 text-action" />
                Module Content
              </CardTitle>
              <CardDescription className="text-xs">
                Each row is one video lesson.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addVideo}>
              <Plus className="size-4" />
              Add module content
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-background p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Content {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-danger"
                    onClick={() => removeVideo(index)}
                    disabled={videos.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>
                    Text (video topic) <span className="text-danger">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. What is Tailwind CSS?"
                    value={video.videoTopic}
                    onChange={(e) => updateVideo(index, "videoTopic", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Video URL (yt or other url) <span className="text-danger">*</span>
                  </Label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={video.videoLink}
                    onChange={(e) => updateVideo(index, "videoLink", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full" onClick={addVideo}>
              <Plus className="size-4" />
              Add module content
            </Button>
          </CardContent>
        </Card>

        {/* Quiz builder */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <HelpCircle className="size-5 text-action" />
                Quiz
              </CardTitle>
              <CardDescription className="text-xs">
                Add multiple-choice questions for this module.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addQuiz}>
              <Plus className="size-4" />
              Add quiz question
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizzes.length === 0 ? (
              <button
                type="button"
                onClick={addQuiz}
                className="w-full rounded-lg border-2 border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground transition-colors hover:border-action/50 hover:text-foreground"
              >
                Click to add a quiz question
              </button>
            ) : (
              quizzes.map((quiz, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-background p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Question {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-danger"
                      onClick={() => removeQuiz(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Question <span className="text-danger">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. What command creates a new Vite project?"
                      value={quiz.question}
                      onChange={(e) => updateQuiz(index, "question", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        Option 1 <span className="text-danger">*</span>
                      </Label>
                      <Input
                        placeholder="Option 1"
                        value={quiz.option1}
                        onChange={(e) => updateQuiz(index, "option1", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Option 2 <span className="text-danger">*</span>
                      </Label>
                      <Input
                        placeholder="Option 2"
                        value={quiz.option2}
                        onChange={(e) => updateQuiz(index, "option2", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Option 3 <span className="text-danger">*</span>
                      </Label>
                      <Input
                        placeholder="Option 3"
                        value={quiz.option3}
                        onChange={(e) => updateQuiz(index, "option3", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Option 4 <span className="text-danger">*</span>
                      </Label>
                      <Input
                        placeholder="Option 4"
                        value={quiz.option4}
                        onChange={(e) => updateQuiz(index, "option4", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`quiz-answer-${index}`}>
                      Correct Answer <span className="text-danger">*</span>
                    </Label>
                    <select
                      id={`quiz-answer-${index}`}
                      value={quiz.answer}
                      onChange={(e) => updateQuiz(index, "answer", e.target.value)}
                      className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-action focus:outline-none focus:ring-1 focus:ring-action"
                    >
                      <option value="">Select correct option</option>
                      <option value={quiz.option1}>Option 1</option>
                      <option value={quiz.option2}>Option 2</option>
                      <option value={quiz.option3}>Option 3</option>
                      <option value={quiz.option4}>Option 4</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      The selected value is stored in the <code>answer</code> field
                      (e.g. <code>answer === option4</code>).
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              disabled={isSaving}
              className="w-full bg-action text-white hover:bg-action-hover"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving module...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Module Content
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Module {moduleNumber}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will save the module to the platform with:
              </AlertDialogDescription>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  • <span className="font-medium text-foreground">{videos.length} video lesson{videos.length === 1 ? "" : "s"}</span>
                </li>
                <li>
                  • <span className="font-medium text-foreground">{quizzes.length} quiz question{quizzes.length === 1 ? "" : "s"}</span>
                </li>
                <li>
                  • Deadline:{" "}
                  <span className="font-medium text-foreground">
                    {deadlineTime ? Number(deadlineTime) : 1} day{Number(deadlineTime) === 1 ? "" : "s"}
                  </span>
                </li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to submit?
              </p>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={() => void saveModule()}
                  className="bg-action text-white hover:bg-action-hover"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}
                  Confirm Submit
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
}