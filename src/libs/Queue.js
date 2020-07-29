const Bee = require('bee-queue')
const SendPasswordMail = require('../app/jobs/SendPasswordMail')
const ResetPasswordMail = require('../app/jobs/ResetPasswordMail')
const redisConfig = require('../config/redis')

const jobs = [SendPasswordMail, ResetPasswordMail]

const queues = {}

jobs.forEach(({ key, handle }) => {
  queues[key] = {
    bee: new Bee(key, {
      redis: redisConfig,
    }),
    handle,
  }
})

function handleFailure(job, error) {
  throw new Error(`Queue ${job.queue.name}: FAILED`, error)
}

module.exports = {
  add(queue, job) {
    return queues[queue].bee.createJob(job).save()
  },

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = queues[job.key]
      bee.on('failed', handleFailure).process(handle)
    })
  },
}
