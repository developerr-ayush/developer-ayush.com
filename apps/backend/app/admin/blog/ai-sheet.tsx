"use client";

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, ImageIcon, Loader2, Sparkles, Square, TriangleAlert } from "lucide-react";
import type { OutputData } from "@editorjs/editorjs";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, fieldA11y } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";

export interface AIResult {
  title: string;
  description?: string;
  slug?: string;
  tags?: string;
  categories?: string[];
  content: OutputData;
}

type ModelId = "gemini-3-pro-preview" | "gemini-3-flash-preview";

const MODELS: { id: ModelId; label: string; note: string }[] = [
  { id: "gemini-3-pro-preview", label: "Gemini 3 Pro", note: "Best quality · queued job, ~30–90 s" },
  { id: "gemini-3-flash-preview", label: "Gemini 3 Flash", note: "Faster · queued job" },
];

type Phase = "idle" | "running" | "done" | "error";

const POLL_MS = 3000;
const TIMEOUT_MS = 4 * 60 * 1000;

function wordCount(content: OutputData) {
  let n = 0;
  for (const b of content.blocks ?? []) {
    const text = typeof b.data?.text === "string" ? b.data.text : "";
    n += text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  }
  return n;
}

/** Poll a GenerationJob until it finishes. Resolves with the parsed result. */
async function pollJob<T>(jobId: string, shouldStop: () => boolean, onTick: (status: string) => void): Promise<T> {
  const started = Date.now();
  while (!shouldStop()) {
    if (Date.now() - started > TIMEOUT_MS) throw new Error("Timed out waiting for the model. The job may still finish; try again in a minute.");
    await new Promise((r) => setTimeout(r, POLL_MS));
    if (shouldStop()) break;
    const res = await fetch(`/api/ai/job/${jobId}`);
    if (!res.ok) continue;
    const data = await res.json();
    onTick(data.status);
    if (data.status === "SUCCESS") {
      const result = typeof data.result === "string" ? JSON.parse(data.result) : data.result;
      return result as T;
    }
    if (data.status === "FAILED") throw new Error(data.error || "The model could not produce a draft.");
  }
  throw new Error("cancelled");
}

export function AISheet({
  open,
  onClose,
  postTitle,
  hasContent,
  onInsert,
  onReplace,
  onBanner,
  confirmReplace,
}: {
  open: boolean;
  onClose: () => void;
  postTitle: string;
  hasContent: boolean;
  onInsert: (r: AIResult) => void | Promise<void>;
  onReplace: (r: AIResult) => void | Promise<void>;
  onBanner: (url: string) => void;
  confirmReplace: () => Promise<boolean>;
}) {
  const [model, setModel] = React.useState<ModelId>("gemini-3-pro-preview");
  const [prompt, setPrompt] = React.useState("");
  const [longForm, setLongForm] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [jobStatus, setJobStatus] = React.useState<string>("");
  const [elapsed, setElapsed] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<AIResult | null>(null);

  const [imgPrompt, setImgPrompt] = React.useState("");
  const [imgPhase, setImgPhase] = React.useState<Phase>("idle");
  const [imgUrl, setImgUrl] = React.useState<string | null>(null);
  const [imgError, setImgError] = React.useState<string | null>(null);

  const runId = React.useRef(0);
  const imgRunId = React.useRef(0);

  // Elapsed-seconds ticker while a draft is generating
  React.useEffect(() => {
    if (phase !== "running") return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Stop polling if the page unmounts
  React.useEffect(
    () => () => {
      runId.current++;
      imgRunId.current++;
    },
    []
  );

  const generate = async () => {
    if (!prompt.trim()) return;
    const id = ++runId.current;
    const stale = () => runId.current !== id;
    setPhase("running");
    setError(null);
    setResult(null);
    setJobStatus("SENDING");
    try {
      const res = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, simplified: !longForm, model }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.jobId) throw new Error(data.error || `Request failed (${res.status})`);
      setJobStatus("PENDING");
      const content = await pollJob<AIResult>(data.jobId, stale, setJobStatus);
      if (stale()) return;
      if (!content?.title || !content?.content?.blocks) throw new Error("The draft came back incomplete. Try again with a clearer prompt.");
      setResult(content);
      setPhase("done");
    } catch (e) {
      if (stale()) return;
      setError(e instanceof Error ? e.message : "Generation failed");
      setPhase("error");
    }
  };

  const cancel = () => {
    runId.current++;
    setPhase("idle");
    toast.info("Stopped waiting. The job may still finish on the server.");
  };

  const generateImage = async () => {
    const text = (imgPrompt || postTitle).trim();
    if (!text) {
      setImgError("Describe the image, or give the post a title first.");
      return;
    }
    const id = ++imgRunId.current;
    const stale = () => imgRunId.current !== id;
    setImgPhase("running");
    setImgError(null);
    setImgUrl(null);
    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `A banner image for a blog post. ${text}` }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.jobId) throw new Error(data.error || `Request failed (${res.status})`);
      const out = await pollJob<{ imageUrl?: string }>(data.jobId, stale, () => {});
      if (stale()) return;
      if (!out?.imageUrl) throw new Error("No image was returned.");
      setImgUrl(out.imageUrl);
      setImgPhase("done");
    } catch (e) {
      if (stale()) return;
      setImgError(e instanceof Error ? e.message : "Image generation failed");
      setImgPhase("error");
    }
  };

  const running = phase === "running";
  const stepIndex = phase === "done" ? 3 : running ? (jobStatus === "SENDING" ? 0 : 1) : 0;
  const steps = ["Sending prompt", "Writing draft", "Ready to review"];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      variant="sheet"
      title="Write with AI"
      description="Draft a post from a prompt, then insert or replace it in the editor."
    >
      <div className="space-y-6">
        <section aria-labelledby="ai-draft" className="space-y-4">
          <h3 id="ai-draft" className="eyebrow">
            Draft
          </h3>
          <Field id="ai-model" label="Model" hint={MODELS.find((m) => m.id === model)?.note}>
            <Select {...fieldA11y("ai-model", undefined, true)} value={model} onChange={(e) => setModel(e.target.value as ModelId)} disabled={running}>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="ai-prompt" label="Prompt" hint="Topic, audience, tone and the points to cover.">
            <Textarea
              {...fieldA11y("ai-prompt", undefined, true)}
              rows={5}
              value={prompt}
              disabled={running}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A practical guide to caching in Next.js for developers moving from the Pages Router."
            />
          </Field>
          <label className="flex items-center gap-2.5 text-[13px]">
            <input type="checkbox" className="size-4 accent-[var(--accent)]" checked={longForm} disabled={running} onChange={(e) => setLongForm(e.target.checked)} />
            Long-form article (takes longer)
          </label>

          <div className="flex items-center gap-2">
            {running ? (
              <Button onClick={cancel}>
                <Square className="size-3.5" aria-hidden="true" /> Stop waiting
              </Button>
            ) : (
              <Button variant="default" onClick={generate} disabled={!prompt.trim()}>
                <Sparkles className="size-4" aria-hidden="true" /> Generate draft
              </Button>
            )}
          </div>

          {/* Progress */}
          <div aria-live="polite" className="space-y-3">
            {running || phase === "done" ? (
              <div className="card space-y-3 p-3.5">
                <ol className="space-y-1.5">
                  {steps.map((s, i) => {
                    const done = i < stepIndex || phase === "done";
                    const current = i === stepIndex && running;
                    return (
                      <li key={s} className="flex items-center gap-2 text-[13px]">
                        {done ? (
                          <CheckCircle2 className="size-4 text-ok" aria-hidden="true" />
                        ) : current ? (
                          <Loader2 className="size-4 animate-spin text-accent" aria-hidden="true" />
                        ) : (
                          <span aria-hidden="true" className="ml-1 size-2 rounded-full border border-line" />
                        )}
                        <span className={done || current ? "" : "text-muted"}>{s}</span>
                      </li>
                    );
                  })}
                </ol>
                {running ? (
                  <>
                    <div className="h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                      <div className="h-full w-1/3 rounded-full bg-accent [animation:ai-slide_1.4s_ease-in-out_infinite]" />
                    </div>
                    <p className="mono text-xs text-muted">
                      {elapsed}s · {jobStatus === "SENDING" ? "sending" : jobStatus.toLowerCase()}
                    </p>
                  </>
                ) : null}
              </div>
            ) : null}

            {phase === "error" && error ? (
              <p role="alert" className="flex items-start gap-2 text-[13px] text-danger">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {error}
              </p>
            ) : null}
          </div>

          {result && phase === "done" ? (
            <div className="card space-y-3 p-4">
              <div>
                <p className="eyebrow">Draft ready</p>
                <h4 className="mt-1 font-serif text-[1.35rem] leading-snug">{result.title}</h4>
                {result.description ? <p className="mt-1.5 text-[13px] text-muted">{result.description}</p> : null}
              </div>
              <p className="mono text-xs text-muted">
                {result.content.blocks.length} blocks · ~{wordCount(result.content)} words
                {result.categories?.length ? ` · ${result.categories.join(", ")}` : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  onClick={async () => {
                    await onInsert(result);
                    toast.success("Draft inserted at the end of the post");
                    onClose();
                  }}
                  disabled={!hasContent}
                  title={hasContent ? undefined : "The post is empty — use Replace"}
                >
                  Insert at end
                </Button>
                <Button
                  onClick={async () => {
                    if (hasContent && !(await confirmReplace())) return;
                    await onReplace(result);
                    toast.success("Post replaced with the draft");
                    onClose();
                  }}
                >
                  {hasContent ? "Replace post" : "Use draft"}
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        <section aria-labelledby="ai-image" className="space-y-4 border-t border-line pt-5">
          <h3 id="ai-image" className="eyebrow">
            Banner image
          </h3>
          <Field id="ai-img-prompt" label="Describe the image" hint="Leave empty to use the post title.">
            <Input {...fieldA11y("ai-img-prompt", undefined, true)} value={imgPrompt} onChange={(e) => setImgPrompt(e.target.value)} disabled={imgPhase === "running"} />
          </Field>
          <div aria-live="polite" className="space-y-3">
            <Button onClick={generateImage} loading={imgPhase === "running"}>
              <ImageIcon className="size-4" aria-hidden="true" /> {imgPhase === "running" ? "Generating…" : "Generate image"}
            </Button>
            {imgPhase === "error" && imgError ? (
              <p role="alert" className="text-[13px] text-danger">
                {imgError}
              </p>
            ) : null}
            {imgUrl ? (
              <div className="space-y-2">
                <div className="relative aspect-video overflow-hidden rounded-[var(--radius-ctl)] border border-line">
                  {/* AI image hosts vary, so skip the optimizer for this transient preview */}
                  <Image src={imgUrl} alt="Generated banner preview" fill unoptimized sizes="400px" className="object-cover" />
                </div>
                <Button
                  variant="default"
                  onClick={() => {
                    onBanner(imgUrl);
                    toast.success("Banner set");
                    setImgUrl(null);
                    setImgPhase("idle");
                  }}
                >
                  Use as banner
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </Dialog>
  );
}
