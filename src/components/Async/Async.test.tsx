import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

test("it renders correctly", async () => {
  render(<Async />);

  expect(screen.getByText("Hello world")).toBeInTheDocument();
  expect(await screen.findByText("Button")).toBeInTheDocument(); //Espera aparecer em tela

//   await waitForElementToBeRemoved(screen.queryByText("Button"));//Espera sair da tela

  await waitFor(() => {
    return expect(screen.getByText("Button")).toBeInTheDocument();
  });
});
