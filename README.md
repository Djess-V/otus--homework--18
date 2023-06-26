<h1 align="center">Библиотека клиентского роутинга</h1>

<p align="center">
<img alt="Badge" src="https://github.com/djess-v/otus--homework--18/actions/workflows/sanity-check.yml/badge.svg" />
</p>

## Getting Started

Install @djess-v/router using [`npm`](https://www.npmjs.com/package/@djess-v/router):

```bash
npm install @djess-v/router
```

Typing

```bash
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
  id: string;
  match: IMatch;
  hooks: IHooks;
}

interface IRouter {
  on: (match: IMatch, hooks?: IHooks) => () => void;
  go: (url: string, state: IState) => void;
  unsubscribeAll: () => void;
}

class Router implements IRouter {
  private listeners: IListener[] = [];

  private previousPath: string;

  private currentPath: string;

  private mode: "history" | "hash";

  constructor(mode: "history" | "hash" = "history") {}
```

Using

```bash
const router = new Router();

router.on("/", {
  onEnter: () => {
    //your code
  },
});
```

## License

@djess-v/router is [MIT licensed](./LICENSE).
