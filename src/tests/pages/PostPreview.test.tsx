import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";

import PostPreviewPage, {
  getStaticProps,
  getStaticPaths,
} from "../../pages/posts/preview/[slug]";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/client");
jest.mock("../../services/prismic.ts");
jest.mock("next/router");

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

const post: Post = {
  slug: "my-new-post",
  title: "My new post",
  content: "<p>Post content</p>",
  updatedAt: "August, 25th",
};

describe("PostPreview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreviewPage post={post} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user if subscription is found", async () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: "fake-active-subscription" },
      false,
    ]);

    useRouterMocked.mockReturnValue({
      push: pushMock,
    } as any);

    render(<PostPreviewPage post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "Post content" }],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post content</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      })
    );
  });

  it("return no static paths", async () => {
    const response = await getStaticPaths({});

    expect(response).toEqual(
      expect.objectContaining({
        paths: [],
        fallback: "blocking",
      })
    );
  });
});
