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
  router.on(/^\/$/, {
    onEnter: createRender("/"),
  });
  const unsubscribe = router.on((path) => path === "/contacts", {
    onEnter: createRender("/contacts"),
    onBeforeEnter: drawInfo("[onBeforeEnter] contacts"),
  });
  router.on("/about", {
    onEnter: createRender("/about"),
    onLeave: createLogger("[onLeave] /about"),
  });
  router.on("/about/us", { onEnter: createRender("/about/us") });
  router.on(/^\/login$/, {
    onEnter: createRender("/login"),
    onBeforeEnter: drawInfo("[onBeforeEnter] login"),
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
