import { LiveInterview } from "@/components/profile/interview/live-interview";

type Params = Promise<{ id: string }>;

const LiveInterviewPage = async (props: { params: Params }) => {
  const { id } = await props.params;
  return <LiveInterview id={id} />;
};

export default LiveInterviewPage;
