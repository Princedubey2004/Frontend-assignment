import { Metadata } from "next";
import { PublicBoardClient } from "./public-board-client";

interface Props {
  params: { boardId: string };
}

export const metadata: Metadata = {
  title: "TaskBoard",
  description: "Public Board",
};

export default async function PublicBoardPage({ params }: Props) {
  const resolvedParams = params && typeof (params as unknown as Promise<{ boardId: string }>).then === "function"
    ? await (params as unknown as Promise<{ boardId: string }>)
    : params;
  
  const { boardId } = resolvedParams;
  return <PublicBoardClient boardId={boardId} />;
}
