import {Box, GlobalStyle, ChakraProvider, ThemeProvider} from '@chakra-ui/react'
import {LayoutProps} from 'jaen'

import {JaenPageLayout} from '../components/JaenPageLayout'
import CustomLayout from '../components/Layout'
import userTheme from '../theme/theme'

const Layout: React.FC<LayoutProps> = ({children, pageProps}) => {
  const {pageConfig} = pageProps.pageContext

  // check if jaen theme is set
  const layout = pageConfig?.layout

  return layout?.name === 'jaen' ? (
    <JaenPageLayout layout={layout.type}>{children}</JaenPageLayout>
  ) : (
    <Box zIndex="1">
      <ThemeProvider theme={userTheme}>
        <CustomLayout pageProps={pageProps}>
          <GlobalStyle />
          {children}
        </CustomLayout>
      </ThemeProvider>
    </Box>
  )
}

export default Layout
