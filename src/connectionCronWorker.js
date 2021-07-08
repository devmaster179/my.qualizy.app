const CronJob = require("cron").CronJob;
const isOnline = require("is-online")
import store from "./store/store"

const job = new CronJob(
  "*/3 * * * * *",
  async () => {
    const online = await isOnline()
    // console.log(store)
    store.commit("UPDATE_INTERNET_ONLINE", online)
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
