import { Suspense, createResource, createSignal } from "solid-js";
import { purgeCache } from "@netlify/functions";
import "./app.css";
import { GET } from "@solidjs/start";

const randomNumber = GET(async function() {
  "use server";
  return new Response(Math.random().toString(), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": "public, s-max-age=31536000",
      "Cache-Tag": "random",
    },
  });
})

async function purge() {
  "use server";
  await purgeCache({tags: ["random"], token: "nfp_mBVixWKoYh8644BHLuUaFcXDGw6wEAXE8193"});
  return true;
}

async function fnPurge() {
  await fetch("/purge");
}

export default function App() {
  const [count, setCount] = createSignal(0);
  const [random] = createResource(async () => {
    const res = await randomNumber();
    return res.text();
  });

  return (
    <main>
      <h1>Hello world!</h1>
      <Suspense fallback="Loading...">{random()}</Suspense>
      <button class="increment" onClick={() => setCount(count() + 1)}>
        Clicks: {count()}
      </button>
      <button class="increment" onClick={() => fnPurge()}>Purge</button>
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
      <form name="contact" method="post" data-netlify>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
