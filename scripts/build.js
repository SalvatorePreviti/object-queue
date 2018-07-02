#!/usr/bin/env node

const logging = require('./lib/logging')
const spawnAsync = require('./lib/spawnAsync')

const path = require('path')
const globby = require('globby')

const root = path.resolve(path.join(__dirname, '..'))

async function doc() {
  const paths = [path.join(root, '*.js')]
  const files = await globby(paths)
  files.sort()

  const args = ['readme', ...files, '--section=API']

  await logging.time('generate documentation', async () => {
    await spawnAsync('documentation', args, {
      stdio: 'inherit',
      cwd: path.join(root)
    })
  })
}

async function compileTs() {
  await logging.time('compile typescript', async () => {
    await Promise.all([spawnAsync('tslint', ['-p', 'tsconfig.json', '-t', 'stylish']), spawnAsync('tsc', ['-p', 'tsconfig.json'])])
  })

  await logging.time('prettify output', async () => {
    await Promise.all([
      spawnAsync('tslint', ['--fix', '-p', 'tsconfig-tslint-definitions.json', '-t', 'stylish', '*.d.ts']),
      spawnAsync('eslint', ['--fix', '**/*.js'])
    ])
    await spawnAsync('prettier', ['--write', '**/*.js', '**/*.ts', '**/*.json'])
  })

  await doc()
}

module.exports = compileTs

require('./lib/executableModule')(module)
