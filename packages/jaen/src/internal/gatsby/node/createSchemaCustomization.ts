import {GatsbyNode} from 'gatsby'

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
  schema
}) => {
  actions.createTypes(`

      type JaenTemplate implements Node {
        id: String!
        name: String!
        displayName: String!
      }

      type JaenPage implements Node {
        id: ID!
        jaenPageMetadata: JaenPageMetadata!
        jaenFields: JSON
        chapters: JSON
        template: JaenTemplate @link
        jaenFiles: [JaenFile!]!
      }

      type JaenFile {
        file: File! @link(from: "file___NODE")
      }

      type JaenPageMetadata {
        title: String!
        description: String
        image: String
        canonical: String
        datePublished: String
        isBlogPost: Boolean
      }
      `)
}
