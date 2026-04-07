import * as core from '@actions/core'
import type { DeployResult, Inputs } from './types.ts'

export async function writeSummary(
  inputs: Inputs,
  result: DeployResult
): Promise<void> {
  // core.summary writes to the GitHub Actions Step Summary panel.
  if (!core.summary) return

  await core.summary
    .addHeading('Sui Smart Contract Deployment')
    .addTable([
      [
        { data: 'Field', header: true },
        { data: 'Value', header: true },
      ],
      ['Environment', inputs.env],
      ['Directory', inputs.dir],
      ['Deploy mode', inputs.deployMode],
      ['Published type', result.publishedType],
      ['Published package ID', result.packageId || '(not resolved)'],
      ['Previous package ID', result.previousPackageId || '(none)'],
      ['Upgrade capability', result.upgradeCap || '(not resolved)'],
      ['Transaction digest', result.digest],
    ])
    .write()
}

export async function writeFailureSummary(
  error: unknown,
  inputs?: Inputs
): Promise<void> {
  if (!core.summary) return

  const errorMessage = error instanceof Error ? error.message : String(error)

  await core.summary
    .addHeading('Sui Smart Contract Deployment Failed')
    .addTable([
      [
        { data: 'Field', header: true },
        { data: 'Value', header: true },
      ],
      ['Environment', inputs?.env ?? '(not resolved)'],
      ['Directory', inputs?.dir ?? '(not resolved)'],
      ['Deploy mode', inputs?.deployMode ?? '(not resolved)'],
      ['Verify deps', inputs ? String(inputs.verifyDeps) : '(not resolved)'],
    ])
    .addHeading('Error Details', 2)
    .addCodeBlock(errorMessage)
    .write()
}
