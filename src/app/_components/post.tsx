"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export function LatestPost() {
  const [latestUser] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createUser = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestUser ? (
        <p className="truncate">
          Your most recent user: {latestUser.firstName} {latestUser.lastName}
        </p>
      ) : (
        <p>You have no users yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUser.mutate({
            emailAddress: "test@example.com", // Replace with proper input
            firstName: name,
            lastName: "Doe", // Add an input for this
            imageUrl: "https://example.com/image.jpg", // Default or user input
          });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createUser.isPending}
        >
          {createUser.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
