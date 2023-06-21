import { Router, IArgs } from "../src/router";

if (PRODUCTION) {
  document.querySelectorAll("a").forEach((link) => {
    link.href = PREFIX + link.pathname;
  });
}

const createRender =
  (content: string) =>
  (...args: IArgs[]) => {
    console.log(`${content} args=${JSON.stringify(args)}`);
    (<HTMLElement>document.getElementById("root")).innerHTML = `${content}`;
  };

const drawInfo =
  (content: string) =>
  (...args: IArgs[]) => {
    console.log(`${content} args=${JSON.stringify(args)}`);
  };

const createLogger =
  (content: string) =>
  (...args: IArgs[]) => {
    console.log(`${content} args=${JSON.stringify(args)}`);
  };

const connectHooks = (router: Router) => {
  router.on(new RegExp(`^${PREFIX}/$`), {
    onEnter: createRender(`${PREFIX}/`),
  });
  const unsubscribe = router.on((path) => path === `${PREFIX}/contacts`, {
    onEnter: createRender(`${PREFIX}/contacts`),
    onBeforeEnter: drawInfo(`[onBeforeEnter] ${PREFIX}contacts`),
  });
  router.on(`${PREFIX}/about`, {
    onEnter: createRender(`${PREFIX}/about`),
    onLeave: createLogger(`[onLeave] ${PREFIX}/about`),
  });
  router.on(`${PREFIX}/about/us`, {
    onEnter: createRender(`${PREFIX}/about/us`),
  });
  router.on(new RegExp(`^${PREFIX}/login$`), {
    onEnter: createRender(`${PREFIX}/login`),
    onBeforeEnter: drawInfo(`[onBeforeEnter] ${PREFIX}login`),
  });

  const contacts = document.getElementById("contacts");

  const handleClickContacts = (e: Event) => {
    e.preventDefault();

    setTimeout(() => {
      unsubscribe();
      console.log(
        `------  Произведена отписка от выполнения хуков при последующих кликах на ссылку - '/contacts'  ------`
      );
    }, 0);

    contacts?.removeEventListener("click", handleClickContacts);
  };

  contacts?.addEventListener("click", handleClickContacts);
};

const connectRouter = (mode: "hash" | "history") => {
  const nav = document.getElementById("nav") as HTMLElement;
  const root = document.getElementById("root") as HTMLElement;

  nav.style.display = "flex";
  root.style.display = "";

  connectHooks(new Router(mode));
};

window.addEventListener("load", () => {
  const links = document.querySelectorAll(
    "[data-name=terms]"
  ) as NodeListOf<HTMLAnchorElement>;

  links.forEach((link) =>
    link.addEventListener("click", () => {
      connectRouter(link.dataset.id as "hash" | "history");

      links.forEach((a) => {
        a.remove();
      });
    })
  );
});
