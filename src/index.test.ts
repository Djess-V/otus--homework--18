import { initial } from ".";

describe("initial", () => {
  it("is a function", () => {
    expect(initial).toBeInstanceOf(Function);

    const log = jest.spyOn(window.console, "log");
    initial("Hello!");

    expect(log).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("Hello!");
  });
});
