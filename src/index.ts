import * as core from '@actions/core'
import { deploy } from './deploy.ts'
import { parseInputs } from './inputs.ts'
import { writeFailureSummary, writeSummary } from './summary.ts'
import type { Inputs } from './types.ts'

async function run(): Promise<void> {
  let inputs: Inputs | undefined

  try {
    inputs = parseInputs()

    core.info(`Deploying Sui package in: ${inputs.dir}`)
    core.info(`Environment : ${inputs.env}`)
    core.info(`Verify deps : ${inputs.verifyDeps}`)
    core.info(`Deploy mode : ${inputs.deployMode}`)

    const result = await deploy(inputs)

    core.setOutput('digest', result.digest)
    core.setOutput('upgrade-cap', result.upgradeCap)
    core.setOutput('published-package-id', result.packageId)
    core.setOutput('published-type', result.publishedType)
    core.setOutput('previous-package-id', result.previousPackageId)

    await writeSummary(inputs, result)

    core.info(`\nDone. published-type=${result.publishedType}`)
  } catch (error) {
    await writeFailureSummary(error, inputs)
    throw error
  }
}

run().catch((err: unknown) => {
  core.setFailed(err instanceof Error ? err.message : String(err))
})
