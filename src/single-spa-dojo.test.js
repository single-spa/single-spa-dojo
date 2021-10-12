import singleSpaDojo from "./single-spa-dojo";
import { jest } from "@jest/globals";

describe("single-spa-dojo", () => {
  it("can bootstrap, mount, and unmount", async () => {
    const mount = jest.fn();
    const unmount = jest.fn();

    const lifecycles = singleSpaDojo({
      renderer() {
        return {
          mount,
          unmount,
        };
      },
      v() {},
      w() {},
      appComponent() {},
    });

    const props = { name: "test" };

    await lifecycles.bootstrap(props);

    expect(mount).not.toHaveBeenCalled();
    await lifecycles.mount(props);
    expect(mount).toHaveBeenCalled();

    expect(unmount).not.toHaveBeenCalled();
    await lifecycles.unmount(props);
    expect(unmount).toHaveBeenCalled();
  });
});
