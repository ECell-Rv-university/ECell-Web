import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validateApplication, type ApplicationState } from "@/app/recruit/application";
import { submitApplication } from "@/app/recruit/actions";

const IDLE: ApplicationState = { status: "idle" };

// Every team asks these on the last step, under its own field names.
const FINAL_ANSWERS: Record<string, string> = {
  weekly_hours: "3–5 hours",
  availability: "Yes",
  clashes: "Nil",
  anything_else: "",
  confirm_accurate: "Yes, I agree",
  confirm_mismatch: "Yes, I agree",
};

function formData(overrides: Record<string, string> = {}): FormData {
  const data = new FormData();
  const values: Record<string, string> = {
    name: "  Asha Rao ",
    email: "Asha.Rao@RVU.edu.in",
    phone: "+91 98765-43210",
    year: "2nd year",
    program: "B.Tech CSE",
    firstChoice: "tech",
    why: "I want to help run events and build tools that make the startup community on campus stronger.",
    experience: "",
    link: "https://github.com/asha",
    "q.tech.built": "A bot that tracks attendance for our club.",
    "q.tech.github": "https://github.com/asha",
    "q.tech.liveProject": "",
    "q.tech.stack": "React",
    "q.tech.interests": "Frontend and UI",
    "q.tech.git": "Basic: clone, commit, push",
    "q.tech.websiteLike": "The halftone footer.",
    "q.tech.websiteImprovement": "A search for past events.",
    "q.tech.webRating": "3",
    "q.design.designCritique": "The Stripe Press covers use calm, confident type and a clear focal point.",
    "q.design.designWork": "https://behance.net/asha",
    "q.design.tools": "Figma",
    "q.design.experience": "Yes",
    "q.design.deadline_comfort": "Comfortable",
    "q.design.collaboration": "Yes",
    "q.design.deadline_rating": "4",
    ...overrides,
  };
  const finalAnswers = Object.fromEntries(
    Object.entries(FINAL_ANSWERS).map(([id, answer]) => [`q.${values.firstChoice}.${id}`, answer]),
  );
  for (const [key, value] of Object.entries({ ...finalAnswers, ...values })) data.set(key, value);
  return data;
}

describe("validateApplication", () => {
  it("normalises a valid application for the sheet", () => {
    const result = validateApplication(formData());
    expect(result).toEqual({
      ok: true,
      data: {
        name: "Asha Rao",
        email: "asha.rao@rvu.edu.in",
        phone: "9876543210",
        year: "2nd year",
        program: "B.Tech CSE",
        firstChoice: "Tech",
        why: expect.stringContaining("startup community"),
        experience: "",
        link: "https://github.com/asha",
        teamAnswers: [
          {
            team: "Tech",
            choice: "First",
            answers: [
              { question: expect.stringContaining("built or worked on"), answer: expect.stringContaining("bot") },
              { question: expect.stringContaining("GitHub profile"), answer: "https://github.com/asha" },
              { question: expect.stringContaining("live project"), answer: "" },
              { question: expect.stringContaining("languages"), answer: "React" },
              { question: expect.stringContaining("interests you"), answer: "Frontend and UI" },
              { question: expect.stringContaining("Git and GitHub"), answer: "Basic: clone, commit, push" },
              { question: expect.stringContaining("like about"), answer: "The halftone footer." },
              { question: expect.stringContaining("one thing you'd improve"), answer: "A search for past events." },
              { question: expect.stringContaining("web development"), answer: "3" },
              { question: expect.stringContaining("hours per week"), answer: "3–5 hours" },
              { question: expect.stringContaining("team meetings"), answer: "Yes" },
              { question: expect.stringContaining("clashes"), answer: "Nil" },
              { question: expect.stringContaining("Anything else"), answer: "" },
              { question: expect.stringContaining("true to the best"), answer: "Yes, I agree" },
              { question: expect.stringContaining("mismatch"), answer: "Yes, I agree" },
            ],
          },
        ],
      },
    });
  });

  it("checks the chosen team's questions by their field names", () => {
    const result = validateApplication(
      formData({
        "q.tech.stack": "",
        "q.tech.github": "not a link",
        "q.tech.liveProject": "not a link either",
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["q.tech.github", "q.tech.liveProject", "q.tech.stack"]);
  });

  it("ignores questions for teams the applicant didn't pick", () => {
    const result = validateApplication(
      formData({ "q.design.portfolio": "", "q.design.tool": "MS Paint" }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.teamAnswers.map((entry) => entry.team)).toEqual(["Tech"]);
  });

  it("stores checked PR outreach tools, including a specified Other answer", () => {
    const data = formData({
      firstChoice: "pr",
      "q.pr.experience": "I handled sponsor outreach for our college fest.",
      "q.pr.networkingComfort": "Comfortable",
      "q.pr.sponsorshipExperience": "Yes",
      "q.pr.confidence": "4",
    });
    data.append("q.pr.outreachTools", "Email");
    data.append("q.pr.outreachTools", "Other");
    data.set("q.pr.outreachTools.other", "Discord");

    const result = validateApplication(data);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.teamAnswers[0].answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ question: "What tools or platforms have you used for communication and outreach?", answer: "Email, Other: Discord" }),
        expect.objectContaining({ question: "Rate your communication & networking confidence", answer: "4" }),
      ]),
    );
  });

  it("stores Social Media & Content Creation platform choices and its creative rating", () => {
    const data = formData({
      firstChoice: "social",
      "q.social.contentPreference": "Reels / Short Content",
      "q.social.managementExperience": "Yes",
      "q.social.contentLinks": "Nil.",
      "q.social.studentContent": "Short practical event highlights and relatable founder stories.",
      "q.social.metricsComfort": "Intermediate",
      "q.social.brainstormingComfort": "Very Comfortable",
      "q.social.creativeIdeation": "5",
    });
    data.append("q.social.platforms", "Instagram");
    data.append("q.social.platforms", "YouTube");

    const result = validateApplication(data);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.teamAnswers[0].answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ question: "Which social media platforms do you use frequently?", answer: "Instagram, YouTube" }),
        expect.objectContaining({ question: "Rate your creative ideation & brainstorming ability", answer: "5" }),
      ]),
    );
  });

  it("requires the commitment and acknowledgement answers for any team", () => {
    const result = validateApplication(
      formData({
        firstChoice: "design",
        "q.design.designCritique": "Bold type and one clear focal point.",
        "q.design.designWork": "https://behance.net/asha",
        "q.design.tools": "Figma",
        "q.design.experience": "Yes",
        "q.design.deadline_comfort": "Comfortable",
        "q.design.collaboration": "Yes",
        "q.design.deadline_rating": "4",
        "q.design.availability": "Maybe",
        "q.design.clashes": "",
        "q.design.confirm_mismatch": "",
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual([
      "q.design.availability",
      "q.design.clashes",
      "q.design.confirm_mismatch",
    ]);
  });

  it("allows the link field to be empty for Design applicants", () => {
    const result = validateApplication(formData({ firstChoice: "design", link: "" }));
    expect(result.ok).toBe(true);
  });

  it("reports every invalid field", () => {
    const result = validateApplication(
      formData({
        name: "A",
        email: "not-an-email",
        phone: "12345",
        year: "5th year",
        program: "",
        firstChoice: "made-up",
        why: "Too short",
        link: "javascript:alert(1)",
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(
      ["email", "firstChoice", "link", "name", "phone", "program", "why", "year"].sort(),
    );
  });

  it("accepts either college email domain", () => {
    for (const email of ["asha.rao@rvu.edu.in", "asha.rao@blr.rvu.edu.in", "Asha.Rao@BLR.rvu.edu.in"]) {
      expect(validateApplication(formData({ email })).ok, email).toBe(true);
    }
  });

  it("rejects an email that isn't a college email", () => {
    for (const email of [
      "asha.rao@gmail.com",
      "asha@rvu.edu.in.evil.com",
      "asha@notrvu.edu.in",
      "asha@blr.rvu.edu.in.evil.com",
      "asha@evil.blr.rvu.edu.in",
    ]) {
      const result = validateApplication(formData({ email }));
      expect(result.ok, email).toBe(false);
      if (result.ok) continue;
      expect(result.errors.email).toMatch(/college email/i);
    }
  });

  it("ignores a second team choice sent by an old tab", () => {
    const result = validateApplication(formData({ secondChoice: "design" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).not.toHaveProperty("secondChoice");
    expect(result.data.teamAnswers.map((entry) => entry.team)).toEqual(["Tech"]);
  });
});

describe("submitApplication", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("RECRUITMENT_SCRIPT_URL", "https://script.google.com/macros/s/test/exec");
    vi.stubEnv("RECRUITMENT_SCRIPT_SECRET", "s3cret");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const scriptReplies = (body: unknown) =>
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body)));

  it("sends the validated application and the secret to Apps Script", async () => {
    scriptReplies({ ok: true });

    const state = await submitApplication(IDLE, formData());

    expect(state).toEqual({ status: "success" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://script.google.com/macros/s/test/exec");
    const body = JSON.parse(init.body);
    expect(body.secret).toBe("s3cret");
    expect(body.application).toMatchObject({ email: "asha.rao@rvu.edu.in", firstChoice: "Tech" });
    expect(body.application.teamAnswers).toHaveLength(1);
  });

  it("returns field errors without calling Apps Script", async () => {
    const state = await submitApplication(IDLE, formData({ email: "nope" }));

    expect(state.status).toBe("error");
    expect(state.errors?.email).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("quietly accepts honeypot submissions without saving them", async () => {
    const data = formData();
    data.set("company", "Spam Inc");

    expect(await submitApplication(IDLE, data)).toEqual({ status: "success" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("flags a duplicate email on the email field", async () => {
    scriptReplies({ ok: false, error: "duplicate" });

    const state = await submitApplication(IDLE, formData());

    expect(state.status).toBe("error");
    expect(state.errors?.email).toMatch(/already applied/i);
  });

  it("doesn't retry when Apps Script rejects the request itself", async () => {
    scriptReplies({ ok: false, error: "unauthorized" });

    const state = await submitApplication(IDLE, formData());

    expect(state.status).toBe("error");
    expect(state.message).toMatch(/try again/i);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  describe("when Apps Script is overloaded", () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ["setTimeout"] });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    // Runs the action while skipping over the waits between retries.
    const submit = async () => {
      const pending = submitApplication(IDLE, formData());
      await vi.runAllTimersAsync();
      return pending;
    };

    it("retries until a save goes through", async () => {
      fetchMock
        .mockResolvedValueOnce(new Response(JSON.stringify({ ok: false, error: "busy" })))
        .mockResolvedValueOnce(new Response("<html>Service unavailable</html>", { status: 503 }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true })));

      expect(await submit()).toEqual({ status: "success" });
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("tells the applicant to try again once retries run out", async () => {
      fetchMock.mockImplementation(async () => new Response(JSON.stringify({ ok: false, error: "busy" })));

      const state = await submit();

      expect(state.status).toBe("error");
      expect(state.message).toMatch(/lots of people are applying/i);
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("reports a retryable error when Apps Script stays unreachable", async () => {
      fetchMock.mockRejectedValue(new TypeError("fetch failed"));

      const state = await submit();

      expect(state.status).toBe("error");
      expect(state.message).toMatch(/try again/i);
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("treats a duplicate after an unclear failure as the first attempt saving", async () => {
      fetchMock
        .mockResolvedValueOnce(new Response("<html>Error</html>", { status: 500 }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ ok: false, error: "duplicate" })));

      expect(await submit()).toEqual({ status: "success" });
    });
  });

  it("doesn't claim a timed-out application was lost", async () => {
    fetchMock.mockRejectedValue(new DOMException("The operation was aborted due to timeout", "TimeoutError"));

    const state = await submitApplication(IDLE, formData());

    expect(state.status).toBe("error");
    expect(state.message).toMatch(/already applied, it went through/);
  });

  it("refuses to drop applications in production when unconfigured", async () => {
    vi.stubEnv("RECRUITMENT_SCRIPT_URL", "");
    vi.stubEnv("NODE_ENV", "production");

    expect((await submitApplication(IDLE, formData())).status).toBe("error");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("logs and succeeds in development when unconfigured", async () => {
    vi.stubEnv("RECRUITMENT_SCRIPT_URL", "");
    vi.stubEnv("NODE_ENV", "development");

    expect(await submitApplication(IDLE, formData())).toEqual({ status: "success" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
