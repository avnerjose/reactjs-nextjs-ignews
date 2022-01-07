import { render, screen, fireEvent } from "@testing-library/react";
import { useSession, signOut, signIn } from "next-auth/client";
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

  it("calls signOut when there is a section", () => {
    const useSessionMocked = mocked(useSession);
    const signOutMocked = mocked(signOut);

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

    const signInButton = screen.getByRole("button");

    fireEvent.click(signInButton);

    expect(signOutMocked).toHaveBeenCalled();
  });

  it("calls signIn when there isn't a section", () => {
    const useSessionMocked = mocked(useSession);
    const signInMocke = mocked(signIn);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    const signInButton = screen.getByRole("button");

    fireEvent.click(signInButton);

    expect(signIn).toHaveBeenCalled();
  });
});
