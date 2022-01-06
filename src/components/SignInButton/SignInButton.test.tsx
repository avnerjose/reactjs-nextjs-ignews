import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { mocked } from "jest-mock";
import { SignInButton } from ".";

jest.mock("next-auth/client");
const useSessionMocked = mocked(useSession);

describe("SignInButton component", () => {
  it("renders correctly when user is not authenticated", () => {
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("renders correctly when user is authenticated", () => {
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
          image: "github.com/johndoe.png",
        },
        expires: "fake-expires",
      },
      false,
    ]);
    render(<SignInButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
