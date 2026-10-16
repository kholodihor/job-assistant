import { describe, expect, it } from "vitest";
import { resumeConfig } from "@/components/profile/resume/config";
import { ResumeData } from "@/types/resume";

const base: ResumeData = { name: "John", email: "j@x.com", phone: "1" };

const full: ResumeData = {
  ...base,
  title: "Original",
  template: "modern",
  photo: "https://res.cloudinary.com/x/a.jpg",
  skills: ["ts", "react"],
  languages: [{ language: "English", level: "C1" }],
  educations: [{ institution: "KPI", degree: "BSc" }],
  workExperiences: [{ id: "old-id", company: "Acme", position: "Dev" }],
};

describe("resumeConfig.normalize", () => {
  it("fills missing arrays with []", () => {
    const normalized = resumeConfig.normalize(base);
    expect(normalized).toMatchObject({
      workExperiences: [],
      educations: [],
      languages: [],
      skills: [],
    });
    expect(normalized.name).toBe("John");
  });

  it("keeps existing arrays", () => {
    expect(resumeConfig.normalize(full).skills).toEqual(["ts", "react"]);
  });
});

describe("resumeConfig.buildCopy", () => {
  it("sets the new title and copies fields", () => {
    const copy = resumeConfig.buildCopy(full, "Copy of Original");
    expect(copy.title).toBe("Copy of Original");
    expect(copy.template).toBe("modern");
    expect(copy.languages).toEqual([{ language: "English", level: "C1" }]);
    expect(copy.workExperiences?.[0]).toMatchObject({
      company: "Acme",
      position: "Dev",
      description: "",
    });
  });

  it("assigns fresh work experience ids", () => {
    const copy = resumeConfig.buildCopy(full, "c");
    expect(copy.workExperiences?.[0].id).toBeTruthy();
    expect(copy.workExperiences?.[0].id).not.toBe("old-id");
  });

  it("deep-copies arrays so mutating the copy leaves the source intact", () => {
    const copy = resumeConfig.buildCopy(full, "c");
    copy.skills!.push("mutated");
    copy.languages![0].level = "A1";
    copy.educations![0].degree = "PhD";
    copy.workExperiences![0].company = "Other";

    expect(full.skills).toEqual(["ts", "react"]);
    expect(full.languages![0].level).toBe("C1");
    expect(full.educations![0].degree).toBe("BSc");
    expect(full.workExperiences![0].company).toBe("Acme");
  });

  it("defaults missing fields", () => {
    const copy = resumeConfig.buildCopy(base, "c");
    expect(copy.template).toBe("classic");
    expect(copy.skills).toEqual([]);
    expect(copy.photo).toBe("");
  });
});

describe("resumeConfig.prepareForSave", () => {
  it("leaves a non-File photo untouched and returns a new object", async () => {
    const result = await resumeConfig.prepareForSave(full);
    expect(result).toEqual(full);
    expect(result).not.toBe(full);
  });
});

describe("resumeConfig.mergeSaved", () => {
  it("merges photo and publicId only when both are returned", () => {
    const prev = { ...base, photo: "data:image/png;base64,AA" };
    expect(
      resumeConfig.mergeSaved(prev, { photo: "https://u", publicId: "p" })
    ).toMatchObject({ photo: "https://u", publicId: "p" });
    expect(resumeConfig.mergeSaved(prev, { photo: "https://u" })).toBe(prev);
  });
});
