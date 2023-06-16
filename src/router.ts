export interface IArgs {
  currentPath: string;
  previousPath: string | null;
  state: Record<string, any>;
}

type IState = Record<string, any>;
type IMatch = RegExp | string | ((path: string) => boolean);
type IHook = (...args: IArgs[]) => Promise<any> | any;

interface IHooks {
  onEnter?: IHook;
  onLeave?: IHook;
  onBeforeEnter?: IHook;
}
interface IListener {
  id: number;
  match: IMatch;
  hooks: IHooks;
}

interface IRouter {
  on: (match: IMatch, hooks?: IHooks) => () => void;
  go: (url: string, state: IState) => void;
}

export class Router implements IRouter {
  private listeners: IListener[] = [];

  private previousPath: string | null = null;

  private mode: "history" | "hash";

  constructor(mode: "history" | "hash" = "history") {
    this.mode = mode;
    this.previousPath = this.getPath();
    this.init();
  }

  static isMatch = (match: IMatch, path: string) =>
    (match instanceof RegExp && match.test(path)) ||
    (typeof match === "function" && match(path)) ||
    (typeof match === "string" && match === path);

  static getQueryParams = (): IState => {
    const searchString = /\?(.+)$/.exec(window.location.href);
    if (!searchString) {
      return {};
    }
    return searchString[1]
      .split("&")
      .reduce((state: IState, param: string): IState => {
        const [name, value] = param.split("=");
        state[name] = value;
        return state;
      }, {});
  };

  private init = () => {
    if (this.mode === "history") {
      window.addEventListener("popstate", this.handlePopState.bind(this));
    } else if (this.mode === "hash") {
      window.addEventListener("hashchange", this.handleHashChange.bind(this));
    }

    document.body.addEventListener("click", this.handleClick.bind(this));
  };

  private getPath = (): string =>
    this.mode === "hash"
      ? window.location.hash === ""
        ? "/"
        : window.location.hash.slice(1)
      : window.location.pathname;

  private currentPath: string = this.getPath();

  private generateId = (): number => {
    const getRandomNumber = () =>
      Math.floor(Math.random() * this.listeners.length * 1000);
    const doesExist = (id: number) =>
      this.listeners.find((listener) => listener.id === id);

    let id = getRandomNumber();
    while (doesExist(id)) {
      id = getRandomNumber();
    }
    return id;
  };

  private handleListener = async (
    { match, hooks }: IListener,
    currentPath: string,
    state: IState = {}
  ) => {
    const argsState = { ...state, ...Router.getQueryParams() };
    const args = {
      currentPath,
      previousPath: this.previousPath,
      state: argsState,
    };

    if (
      this.previousPath &&
      Router.isMatch(match, this.previousPath) &&
      hooks.onLeave
    ) {
      await hooks.onLeave(args);
      return;
    }

    if (Router.isMatch(match, currentPath) && hooks.onBeforeEnter) {
      await hooks.onBeforeEnter(args);
    }

    if (Router.isMatch(match, currentPath) && hooks.onEnter) {
      await hooks.onEnter(args);
    }
  };

  private handleAllListeners = (
    prevPath: string,
    path: string,
    state: IState = {}
  ): void => {
    const prevListener = this.listeners.find((listener) =>
      Router.isMatch(listener.match, prevPath as string)
    );

    if (prevListener) {
      this.handleListener(prevListener, path, state);
    }

    const currentListener = this.listeners.find((listener) =>
      Router.isMatch(listener.match, path as string)
    );

    if (currentListener) {
      this.handleListener(currentListener, path, state);
    }
  };

  on = (match: IMatch, hooks: IHooks = {}): (() => void) => {
    const id = this.generateId();

    const listener = { id, match, hooks };
    this.listeners.push(listener);
    this.handleListener(listener, this.currentPath);

    return () => {
      this.listeners = this.listeners.filter((item) => item.id !== id);
    };
  };

  go = (url: string, state: IState = {}): void => {
    this.previousPath = this.currentPath;
    if (this.mode === "hash") {
      window.location.hash = url;
    } else if (this.mode === "history") {
      window.history.pushState(state, "", url);
    }
    this.currentPath = this.getPath();

    this.handleAllListeners(this.previousPath, this.currentPath, state);
  };

  private handleClick = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).matches("a")) {
      return;
    }
    event.preventDefault();

    const url = (<HTMLAnchorElement>event.target).getAttribute("href") ?? "";
    this.go(url);
  };

  private handlePopState = () => {
    this.previousPath = this.currentPath;
    this.currentPath = this.getPath();
    this.handleAllListeners(this.previousPath, this.currentPath, {});
  };

  private handleHashChange = () => {
    if (this.currentPath === this.getPath()) {
      return;
    }
    this.previousPath = this.currentPath;
    this.currentPath = this.getPath();
    this.handleAllListeners(this.previousPath, this.currentPath, {});
  };
}