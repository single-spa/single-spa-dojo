// opts are what is passed to singleSpaDojo({...})
const defaultOpts = {
  renderer: null,
  v: null,
  w: null,
  appComponent: null,
  mountOptions: {}
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
    ...userOpts
  };

  const lifecycles = {
    bootstrap,
    mount,
    unmount
  };

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
    });
  }

  function unmount(props) {
    return Promise.resolve().then(() => {
      // TODO - find a way to unmount the previously rendered
      const renderResult = opts.renderer(() =>
        opts.v("div", { style: "display: none;" })
      );
      renderResult.mount(opts.mountOptions);
    });
  }
}

function chooseDomElementGetter(opts, props) {
  props = props && props.customProps ? props.customProps : props;
  if (props.domElement) {
    return () => props.domElement;
  } else {
    return defaultDomElementGetter(props);
  }
}

function defaultDomElementGetter(props) {
  const appName = props.appName || props.name;
  if (!appName) {
    throw Error(
      `single-spa-dojo was not given an application name as a prop, so it can't make a unique dom element container for the dojo application`
    );
  }
  const htmlId = `single-spa-application:${appName}`;

  return function defaultDomEl() {
    let domElement = document.getElementById(htmlId);
    if (!domElement) {
      domElement = document.createElement("div");
      domElement.id = htmlId;
      document.body.appendChild(domElement);
    }

    return domElement;
  };
}
