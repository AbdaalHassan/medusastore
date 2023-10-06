import { TransactionBaseService } from "@medusajs/medusa";
import { PostRepository } from "../repositories/post";
import { Post } from "../models/post";

class PostService extends TransactionBaseService {
  protected postRepository_: typeof PostRepository;

  constructor(container) {
    super(container);
    this.postRepository_ = container.postRepository;
  }

  async list(): Promise<Post[]> {
    const postRepo = this.activeManager_.withRepository(this.postRepository_);
    return await postRepo.find();
  }
}

export default PostService;
