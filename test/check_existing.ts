import Nock from "nock";
import { test } from "tap";
import { checkForExisting } from "../src/check_existing";
import { testContext } from "./helpers";

test("checkForExisting", async (t) => {
  const ctx = testContext();
  Nock("https://api.github.com")
    .get("/repos/foo/bar/issues?labels=linkrot")
    .reply(200, []);
  t.equal(await checkForExisting(ctx), undefined);
});

test("checkForExisting - with existing", async (t) => {
  const ctx = testContext();
  Nock("https://api.github.com")
    .get("/repos/foo/bar/issues?labels=linkrot")
    .reply(200, [
      {
        pull_request: {
          html_url: "http://foo.com",
        },
      },
    ]);
  await t.rejects(checkForExisting(ctx));
  t.same(ctx.messages, [
    `Skipping linkrot because a pull request already exists
http://foo.com`,
  ]);
});
