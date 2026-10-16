import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type Params = Promise<{ token: string }>;

export default async function ResetPasswordPage(props: { params: Params }) {
  const { token } = await props.params;
  return <ResetPasswordForm token={token} />;
}
