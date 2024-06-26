import {Field, PageConfig, PageProps} from 'jaen'

const Page: React.FC<PageProps> = ({location, pageContext}) => {
  return <Field.Editor name="editor" />
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Editor',
  icon: 'FaEdit'
}
