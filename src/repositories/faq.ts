import { FAQ } from "../models/faq"
import { dataSource } from '@medusajs/medusa/dist/loaders/database'

export const FAQRepository = dataSource.getRepository(FAQ)
export default FAQRepository