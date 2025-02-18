import { renderHook } from "@testing-library/react";
import usePreviousProps from "@/hooks/use-previous-props";

describe("usePreviousProps", () => {
  it("should return undefined for the first render", () => {
    const { result } = renderHook(() => usePreviousProps("initial value"));

    expect(result.current).toBeNull();
  });

  it("should return the previous value of the prop", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousProps(value),
      { initialProps: { value: "initial value" } },
    );

    rerender({ value: "updated value" });

    expect(result.current).toEqual("initial value");
  });
});
