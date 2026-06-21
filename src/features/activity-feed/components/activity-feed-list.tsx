"use client";

import { useActivityFeed } from "../hooks/use-activity-feed";

/**
 * Activity Feed panel.
 * Subscribes to mock workspace audit logs.
 */
export function ActivityFeedList({ workspaceId }: { workspaceId: string }) {
  const { data: activities, isLoading } = useActivityFeed(workspaceId);

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <div className="h-4 w-28 bg-slate-800 rounded animate-pulse" />
        <div className="h-10 w-full bg-slate-900 rounded animate-pulse" />
        <div className="h-10 w-full bg-slate-900 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/30 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <h4 className="font-semibold text-sm text-slate-200">Activity Feed</h4>
        <p className="text-[10px] text-slate-500">Live events in this workspace</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[30rem] scrollbar-thin">
        {activities?.map((activity) => (
          <div key={activity.id} className="text-xs text-slate-400 leading-normal border-b border-slate-800/40 pb-2">
            <p>
              <strong className="text-slate-200">{activity.user.name}</strong>{" "}
              <span className="text-slate-500 font-mono text-[10px]">
                [{activity.action}]
              </span>{" "}
              {activity.entityType.toLowerCase()}:{" "}
              <span className="text-blue-400 font-medium">{activity.entityName}</span>
            </p>
            <span className="text-[9px] text-slate-600 block mt-1">
              {new Date(activity.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}

        {!activities || activities.length === 0 ? (
          <div className="text-center py-6 text-slate-600 text-xs italic">
            No events logged yet. Try moving a task or creating a board!
          </div>
        ) : null}
      </div>
    </div>
  );
}
