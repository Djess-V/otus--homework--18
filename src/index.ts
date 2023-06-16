import { Router } from "./router";
import type { IArgs } from "./router";

const createRender =
  (content: string) =>
  (...args: IArgs[]) => {
    console.info(`${content} args=${JSON.stringify(args)}`);
    (<HTMLElement>(
      document.getElementById("root")
    )).innerHTML = `<h2>${content}</h2>`;
  };

const createLogger =
  (content: string) =>
  (...args: IArgs[]) => {
    console.info(`${content} args=${JSON.stringify(args)}`);
  };

const drawInfo =
  (content: string) =>
  (...args: IArgs[]) => {
    console.info(`${content} args=${JSON.stringify(args)}`);
  };

window.addEventListener("load", () => {
  const router = new Router();

  const unsubscribe = router.on(/^\/$/, {
    onEnter: createRender("/"),
  });
  router.on((path) => path === "/contacts", {
    onEnter: createRender("/contacts"),
    onLeave: createLogger("[leaving] contacts"),
  });
  router.on("/about", {
    onEnter: createRender("/about"),
    onLeave: createLogger("[leaving] /about"),
  });
  router.on("/about/us", {
    onBeforeEnter: drawInfo("[info] /about/us"),
    onEnter: createRender("/about/us"),
  });
  router.on("/login", {
    onEnter: createRender("/login"),
  });
});

export default Router;
