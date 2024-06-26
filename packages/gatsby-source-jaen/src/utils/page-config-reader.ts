import fs from 'fs'
import path from 'path'
import {parse, ParserOptions} from '@babel/parser'
import traverse, {NodePath} from '@babel/traverse'
import * as t from '@babel/types'
import ts from 'typescript'
import generate from '@babel/generator'

import {PageConfig} from 'jaen'

function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

function parseFileContent(
  content: string,
  isTypeScript: boolean
): t.File | undefined {
  const parserOptions: ParserOptions = isTypeScript
    ? {
        plugins: ['jsx', 'typescript'],
        sourceType: 'module'
      }
    : {
        plugins: ['jsx'],
        sourceType: 'module'
      }

  try {
    return parse(content, parserOptions)
  } catch (err) {
    console.error('Error parsing file:', err)
    return undefined
  }
}

function extractDataFromConfig(
  configObject: t.ObjectExpression
): Record<string, any> {
  const data: Record<string, any> = {}

  function processValue(value: t.Expression): any {
    if (
      t.isStringLiteral(value) ||
      t.isNumericLiteral(value) ||
      t.isBooleanLiteral(value)
    ) {
      return value.value
    } else if (t.isArrayExpression(value)) {
      return value.elements.map(element => processValue(element as any))
    } else if (t.isObjectExpression(value)) {
      return extractDataFromConfig(value)
    } else if (
      t.isFunctionExpression(value) ||
      t.isArrowFunctionExpression(value)
    ) {
      // Return as string
      return {
        type: 'function',
        value: generate(value as any).code
      }
    } else {
      // console.log('Unhandled value type:', value.type)
      // Handle other types as needed (null, undefined, object expressions, etc.)
      return null // You can modify this default behavior according to your requirements
    }
  }

  configObject.properties.forEach(property => {
    if (t.isObjectProperty(property) && t.isIdentifier(property.key)) {
      const key = property.key.name
      const value = property.value
      data[key] = processValue(value as any)
    }
  })

  return data
}

function findConfigObject(ast: t.File): t.ObjectExpression | undefined {
  let configObject: t.ObjectExpression | undefined = undefined

  traverse(ast as any, {
    ExportNamedDeclaration(path: NodePath<t.ExportNamedDeclaration>) {
      const node = path.node.declaration
      if (node && t.isVariableDeclaration(node)) {
        const declarationName = (node.declarations[0]?.id as t.Identifier)?.name
        if (
          declarationName === 'pageConfig' &&
          t.isObjectExpression(node.declarations[0]?.init)
        ) {
          configObject = node.declarations[0]?.init
        }
      }
    }
  })

  return configObject
}

function readConfigFromFile(filePath: string): object | undefined {
  const fileContent = readFileContent(filePath)
  const fileExtension = path.extname(filePath).toLowerCase()
  const isTypeScript = fileExtension === '.ts' || fileExtension === '.tsx'

  const ast = parseFileContent(fileContent, isTypeScript)
  if (!ast) {
    console.error('Could not parse the file:', filePath)
    return undefined
  }

  const configObject = findConfigObject(ast)
  if (!configObject) {
    // console.error('No "config" object found in the file:', filePath)
    return undefined
  }

  const data = extractDataFromConfig(configObject)
  return data
}

export const readPageConfig = (filePath: string): PageConfig | undefined => {
  const configObject = readConfigFromFile(filePath)

  if (!configObject) {
    return undefined
  }

  let childTemplates = (configObject as any).childTemplates || []

  // Prepend `JaenTemplate` to child templates if not already present
  childTemplates = childTemplates.map((childTemplate: string) => {
    if (childTemplate.startsWith('JaenTemplate')) {
      return childTemplate
    } else {
      return `JaenTemplate ${childTemplate}`
    }
  })

  return {
    ...configObject,
    label: (configObject as any).label || 'Untitled',
    childTemplates
  }
}
