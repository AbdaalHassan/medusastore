import { TransactionBaseService } from '@medusajs/medusa'
import { FAQRepository } from '../repositories/faq'

export default class FaqService extends TransactionBaseService {

	protected readonly faqRepository_: typeof FAQRepository

	constructor({ faqRepository }) {
		super(arguments[0])
		this.faqRepository_ = faqRepository
	}

	async getfaqs() {
		/* @ts-ignore */
		const faqRepository = this.activeManager_.withRepository(this.faqRepository_)
		return await faqRepository.find()
	}	

  async getFaqById(id) {
		/* @ts-ignore */
		const faqRepository = this.activeManager_.withRepository(this.faqRepositoryy_)
		return await faqRepository.findOne({
			where: { id }
		})
	}

	async addFaq(faq) {
		if (!faq || !faq.question || !faq.answer) {
		  throw new Error("Contact requires a unique question and a answer");
		}
	  
		/* @ts-ignore */
		const faqRepository = this.activeManager_.withRepository(this.faqRepository_);
	  
		const createdFaq = await faqRepository.create({
		  question: faq.question,
		  answer: faq.answer
		});
	  
		const savedFaq = await faqRepository.save(createdFaq);
		return savedFaq;
	  }
	  
      
	
	async updateFaq(id, post) {
		const { question, answer} = post
		if (!id || !question) throw new Error("Updating a FAQ requires an id, and a unique Question")
		/* @ts-ignore */
		const faqRepository = this.activeManager_.withRepository(this.faqRepository_)
		const existingFaq = await faqRepository.findOne({ 
			where: { id } 
		})
		if (!existingFaq) throw new Error("No FAQ found with that id")
		existingFaq.question = question
		existingFaq.answer = answer
		const faq = await faqRepository.save(existingFaq)
		return faq
	}

	async deleteFaq(id) {
		if (!id) throw new Error("Deleting a faq requires an id")
		/* @ts-ignore */
		const faqRepository = this.activeManager_.withRepository(this.faqRepository_)
		return await faqRepository.delete(id)
	}
}