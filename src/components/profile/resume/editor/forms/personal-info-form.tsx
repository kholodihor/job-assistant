import Image from "next/image";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/types/resume";
import { personalInfoSchema } from "./schema";

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const PersonalInfoForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const t = useTranslations("Form");

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: resumeData?.name || "",
      profession: resumeData?.profession || "",
      photo: resumeData?.photo || "",
      location: resumeData?.location || "",
      phone: resumeData?.phone || "",
      email: resumeData?.email || "",
      telegram: resumeData?.telegram || "",
      github: resumeData?.github || "",
      linkedin: resumeData?.linkedin || "",
      behance: resumeData?.behance || "",
      dribbble: resumeData?.dribbble || "",
      adobePortfolio: resumeData?.adobePortfolio || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        form.setValue("photo", base64);
      } catch (error) {
        console.error("Error converting file:", error);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("steps.personalInfo.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("steps.personalInfo.description")}
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.profession")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.profession")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    name={field.name}
                  />
                </FormControl>
                <div className="flex items-center gap-4">
                  {value && (
                    <div className="mt-2">
                      <Image
                        src={value as string}
                        alt="Preview"
                        className="h-20 w-20 rounded-full object-cover"
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.location")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.location")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.phone")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.phone")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.email")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.email")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.telegram")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.telegram")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.github")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.github")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.linkedin")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.linkedin")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="behance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.behance")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.behance")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dribbble"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.dribbble")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholders.dribbble")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adobePortfolio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labels.adobePortfolio")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.adobePortfolio")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
