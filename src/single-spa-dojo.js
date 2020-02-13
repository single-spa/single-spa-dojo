// opts are what is passed to singleSpaDojo({...})
const defaultOpts = {
  renderer: null,
	mountOptions: {
		registry: null
	}
};

export default function singleSpaDojo(userOpts) {
  if (typeof userOpts !== "object") {
    throw new Error(`single-spa-dojo requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts
  };

  const lifecycles = {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts)
  };

  return lifecycles;
}

function bootstrap(opts, props) {
  return Promise.resolve();
}

function mount(opts, props) {
  return Promise.resolve().then(() => {
    const domElementGetter = chooseDomElementGetter(opts, props);
    const domElement = getRootDomEl(domElementGetter, props);
	opts.mountOpts.domNode = domElement
	opts.renderer.mount(opts.mountOptions)
}

function unmount(opts, props) {
  return Promise.resolve().then(() => {
     renderer(() => <div style="display: none" />).mount({ domNode });
  });
}

function chooseDomElementGetter(opts, props) {
  props = props && props.customProps ? props.customProps : props;
  if (props.domElement) {
    return () => props.domElement;
  } else if (props.domElementGetter) {
    return props.domElementGetter;
  } else if (opts.domElementGetter) {
    return opts.domElementGetter;
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
