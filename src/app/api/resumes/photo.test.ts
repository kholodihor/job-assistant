import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteImage, uploadBase64Image } from "@/lib/cloudinary";
import { resolvePhoto } from "./photo";

vi.mock("@/lib/cloudinary", () => ({
  isDataUri: (value: unknown): value is string =>
    typeof value === "string" && value.startsWith("data:"),
  uploadBase64Image: vi.fn(),
  deleteImage: vi.fn(),
}));

const upload = vi.mocked(uploadBase64Image);
const remove = vi.mocked(deleteImage);

const DATA_URI = "data:image/png;base64,AAAA";
const existing = {
  photo: "https://res.cloudinary.com/x/old.jpg",
  publicId: "cvbaza/old",
};

beforeEach(() => {
  vi.clearAllMocks();
  upload.mockResolvedValue({
    url: "https://res.cloudinary.com/x/new.jpg",
    publicId: "cvbaza/new",
  });
});

describe("resolvePhoto", () => {
  it("uploads a new data URI when nothing is stored", async () => {
    await expect(resolvePhoto(DATA_URI)).resolves.toEqual({
      photo: "https://res.cloudinary.com/x/new.jpg",
      publicId: "cvbaza/new",
    });
    expect(upload).toHaveBeenCalledWith(DATA_URI);
    expect(remove).not.toHaveBeenCalled();
  });

  it("uploads a replacement data URI and deletes the old image", async () => {
    await expect(resolvePhoto(DATA_URI, existing)).resolves.toEqual({
      photo: "https://res.cloudinary.com/x/new.jpg",
      publicId: "cvbaza/new",
    });
    expect(upload).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledWith("cvbaza/old");
  });

  it.each([null, undefined, ""])(
    "deletes the stored image when photo is %p",
    async (photo) => {
      await expect(resolvePhoto(photo, existing)).resolves.toEqual({
        photo: null,
        publicId: null,
      });
      expect(remove).toHaveBeenCalledWith("cvbaza/old");
      expect(upload).not.toHaveBeenCalled();
    }
  );

  it("returns nulls without deleting when nothing is stored", async () => {
    await expect(resolvePhoto(null)).resolves.toEqual({
      photo: null,
      publicId: null,
    });
    expect(remove).not.toHaveBeenCalled();
  });

  it("keeps the stored photo when the URL is unchanged", async () => {
    await expect(resolvePhoto(existing.photo, existing)).resolves.toEqual(
      existing
    );
    expect(upload).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it("deletes the old upload when replaced by a different non-data URL", async () => {
    await expect(
      resolvePhoto("https://example.com/other.jpg", existing)
    ).resolves.toEqual({
      photo: "https://example.com/other.jpg",
      publicId: null,
    });
    expect(upload).not.toHaveBeenCalled();
    expect(remove).toHaveBeenCalledWith("cvbaza/old");
  });

  it("stores a non-data URL with a null publicId when nothing is stored", async () => {
    await expect(resolvePhoto("https://example.com/a.jpg")).resolves.toEqual({
      photo: "https://example.com/a.jpg",
      publicId: null,
    });
  });
});
