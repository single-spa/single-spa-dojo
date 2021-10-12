import { chooseDomElementGetter } from "dom-element-getter-helpers";

// opts are what is passed to singleSpaDojo({...})
const defaultOpts = {
  renderer: null,
  v: null,
  w: null,
  appComponent: null,
  mountOptions: {},
};

export default function singleSpaDojo(userOpts) {
  if (typeof userOpts !== "object") {
    throw Error(`single-spa-dojo requires a configuration object`);
  }

  if (typeof userOpts.renderer !== "function") {
    throw Error(
      `single-spa-dojo requires a function renderer opt to be provided.`
    );
  }

  if (typeof userOpts.v !== "function") {
    throw Error(`single-spa-dojo requires a 'v' function to be provided`);
  }

  if (typeof userOpts.w !== "function") {
    throw Error(`single-spa-dojo requires a 'w' function to be provided`);
  }

  if (typeof userOpts.appComponent !== "function") {
    throw Error(
      `single-spa-dojo requires an appComponent opt to be provided. This should be a class/function`
    );
  }

  const opts = {
    ...defaultOpts,
    ...userOpts,
  };

  const lifecycles = {
    bootstrap,
    mount,
    unmount,
  };

  const renderResults = {};

  return lifecycles;

  function bootstrap(props) {
    return Promise.resolve();
  }

  function mount(props) {
    return Promise.resolve().then(() => {
      if (!opts.mountOptions.domNode) {
        const domElementGetter = chooseDomElementGetter(opts, props);
        const domElement = domElementGetter();
        opts.mountOptions.domNode = domElement;
      }

      const renderResult = opts.renderer(() =>
        opts.w(opts.appComponent, props)
      );
      renderResult.mount(opts.mountOptions);
      renderResults[props.name] = renderResult;
    });
  }

  function unmount(props) {
    return Promise.resolve().then(() => {
      const renderResult = renderResults[props.name];
      renderResult.unmount();
      delete renderResults[props.name];
    });
  }
}
