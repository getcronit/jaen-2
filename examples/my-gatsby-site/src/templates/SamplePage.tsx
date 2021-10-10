import {Heading} from '@chakra-ui/layout'
import {Box} from '@chakra-ui/react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button
} from '@chakra-ui/react'
import {BlockContainer, fields} from '@snek-at/jaen-pages'
import type {JaenTemplate} from '@snek-at/jaen-pages/src/types'
import * as React from 'react'

import SampleBlock from '../blocks/SampleBlock'

const SamplePage: JaenTemplate = () => {
  return (
    <>
      <Heading>Sample Page</Heading>
      <h1>h1 heading</h1>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <h1>IndexField</h1>
        <fields.IndexField
          onRender={(page, pageId) => <div> {Object.keys(page.children)}</div>}
        />
      </Box>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <h1>ChoiceField</h1>
        <fields.ChoiceField
          fieldName="choiceField"
          initValue="a" // optional
          header="ChoiceField Test Header"
          options={['a', 'b', 'c', 'd']}
          onRenderPopover={(selection, options, select) => (
            <>
              {options.map((option, key) => (
                <Button
                  key={key}
                  disabled={option === selection}
                  onClick={() => select(option)}>
                  {option}
                </Button>
              ))}
            </>
          )}
          onRender={selection => <div>{selection}</div>}
        />
      </Box>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <h1>BlockContainer</h1>
        <BlockContainer
          name="blockcontainer1"
          displayName="My Sample Container"
          blocks={[SampleBlock]}
        />
      </Box>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <h1>TextField</h1>
        <fields.TextField
          fieldName="textfield1"
          initValue="<p>textfield1</p>"
        />
      </Box>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <h1>ImageField</h1>
        <fields.ImageField
          fieldName="imagefield1"
          initValue={{
            src: 'https://placekitten.com/800/600',
            alt: 'ta',
            title: 'daa'
          }}
          style={{width: '100%'}}
        />
      </Box>
    </>
  )
}

SamplePage.TemplateName = 'SamplePage'

export default SamplePage
