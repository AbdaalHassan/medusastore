import {
    Column,
    Entity,
    Index,
    BeforeInsert,
  } from "typeorm"
  import { BaseEntity } from "@medusajs/medusa"
  import { generateEntityId } from "@medusajs/utils"
  
  @Entity()
  export class FAQ extends BaseEntity {
    @Index({ unique: true })
    @Column()
    question: string
    
    @Column()
    answer: string  

    @BeforeInsert()
   private beforeInsert(): void {
      this.id = generateEntityId(this.id, "faq")
   }
  }
  
  /**
   * @schema FAQ
   * title: "FAQ"
   * description: "Frequently asked questions"
   * type: object
   * required:
   *   - question
   *   - answer
   * properties:
   *   id:
   *     description: The question's ID
   *     type: string
   *     example: faq123
   *   question:
   *     description: The question.
   *     type: string
   *     example: What is average shipping time
   *   answer:
   *     description: answer of the question.
   */
  