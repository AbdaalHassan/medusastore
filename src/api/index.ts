import { Router } from "express";
import bodyParser from "body-parser";
import configLoader from "@medusajs/medusa/dist/loaders/config";
import cors from "cors";
import { z } from "zod";
import { MedusaError } from "@medusajs/utils";
import { authenticate } from "@medusajs/medusa";

export default (container) => {
  const app = Router();
  const config = configLoader(container);
  const storeCorsOptions = {
    origin: config.projectConfig.store_cors.split(","),
    credentials: true,
  };
  const adminCorsOptions = {
    origin: config.projectConfig.admin_cors.split(","),
    credentials: true,
  };

  // Add authentication to all admin routes *except*
  // auth and account invite ones
  app.use(
    /\/admin\/((?!auth)(?!invites).*)/,
    cors(adminCorsOptions),
    authenticate()
  );

  //start of APIs for pages----------------

  //GET ALL PAGES ON STORE
  app.get("/store/pages", cors(storeCorsOptions), async (req, res) => {
    const pageService = req.scope.resolve("pageService");
    pageService.getPages().then((pages) => {
      return res.json(pages);
    });
  });

  // GET A SINGLE PAGE BY HANDLE OR ID ON STORE
  app.get(
    "/store/page/:identifier",
    cors(storeCorsOptions),
    async (req, res) => {
      const pageService = req.scope.resolve("pageService");
      const identifier = req.params.identifier;

      // Try to get the page by handle first
      pageService.getPageByHandle(identifier).then((pageByHandle) => {
        if (pageByHandle) {
          // Page found by handle, return it
          return res.json(pageByHandle);
        } else {
          // If page not found by handle, try to get it by id
          pageService.getPageById(identifier).then((pageById) => {
            // If page found by id, return it
            if (pageById) {
              return res.json(pageById);
            } else {
              // Page not found by handle or id
              return res.json({ message: "No record found" });
            }
          });
        }
      });
    }
  );

  // GET ALL PAGES ON ADMIN
  app.options("/admin/pages", cors(adminCorsOptions), bodyParser.json());
  app.get("/admin/pages", cors(adminCorsOptions), async (req, res) => {
    const pageService = req.scope.resolve("pageService");
    pageService.getPages().then((pages) => {
      return res.json({ pages });
    });
  });

  // GET A SINGLE PAGE BY ID ON ADMIN
  app.get("/admin/page/:id", cors(adminCorsOptions), async (req, res) => {
    const pageService = req.scope.resolve("pageService");
    pageService.getPageById(req.params.id).then((page) => {
      return res.json({ page });
    });
  });

  // ADD A PAGE
  app.options("/admin/page", cors(adminCorsOptions), bodyParser.json());
  app.post(
    "/admin/page",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        handle: z.string().optional(),
        title: z.string().min(1),
        metadata: z.string().optional(),
        body: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const pageService = req.scope.resolve("pageService");
      pageService.addPage(data).then((page) => {
        return res.json(page);
      });
    }
  );

  // UPDATE A PAGE
  app.options("/admin/page/:id", cors(adminCorsOptions));
  app.post(
    "/admin/page/:id",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        handle: z.string().optional(),
        title: z.string().min(1),
        metadata: z.string().optional(),
        body: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const pageService = req.scope.resolve("pageService");
      pageService.updatePage(req.params.id, data).then((page) => {
        return res.json({ page });
      });
    }
  );

  // DELETE A PAGE
  app.delete("/admin/page/:id", cors(adminCorsOptions), async (req, res) => {
    const pageService = req.scope.resolve("pageService");
    pageService.deletePage(req.params.id).then(() => {
      return res.sendStatus(200);
    });
  });

  
  //DELETE A PAGE BY POST METHOD --- because useAdminCustomDelete did not get dynamic id on run time 
  app.options("/admin/delete-page/", cors(adminCorsOptions));
  app.post(
    "/admin/delete-page/",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        id: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const pageService = req.scope.resolve("pageService");
      pageService.deletePage(data.id).then((page) => {
        return res.json({ page });
      });
    }
  );
  // end of APIs for pages--------------------

  //start of APIs for brand-------------------

  //GET ALL BRANDS
  app.get("/store/brands", cors(storeCorsOptions), async (req, res) => {
    const brandService = req.scope.resolve("brandService");
    brandService.getBrands().then((brands) => {
      return res.json(brands);
    });
  });

  // GET A SINGLE BRAND BY NAME OR ID OR HANDLE
  app.get("/store/brand/:param", cors(storeCorsOptions), async (req, res) => {
    const brandService = req.scope.resolve("brandService");
    const param = req.params.param;

    // Try to get the brand by name
    brandService.getBrandByName(param).then((brand) => {
      if (brand) {
        return res.json(brand);
      } else {
        // If brand not found by name, try to get it by ID
        brandService.getBrandById(param).then((brandById) => {
          if (brandById) {
            return res.json(brandById);
          } else {
            // If brand not found by ID, try to get it by handle
            brandService.getBrandByHandle(param).then((brandByHandle) => {
              if (brandByHandle) {
                return res.json(brandByHandle);
              } else {
                // If still not found, return "no record found"
                return res.json({ message: "No record found" });
              }
            });
          }
        });
      }
    });
  });

  // GET ALL BRANDS
  app.options("/admin/brands", cors(adminCorsOptions), bodyParser.json());
  app.get("/admin/brands", cors(adminCorsOptions), async (req, res) => {
    const brandService = req.scope.resolve("brandService");
    brandService.getBrands().then((brands) => {
      return res.json({ brands });
    });
  });

  // GET A SINGLE BRAND BY ID OR HANDLE ON ADMIN
  app.get("/admin/brand/:id", cors(adminCorsOptions), async (req, res) => {
    const brandService = req.scope.resolve("brandService");
    brandService.getBrandById(req.params.id).then((brand) => {
      if (brand) {
        return res.json({ brand });
      } else {
        brandService.getBrandByHandle(req.params.id).then((brandByHandle) => {
          return res.json({ brandByHandle });
        });
      }
    });
  });

  // ADD A BRAND
  app.options("/admin/brand", cors(adminCorsOptions), bodyParser.json());
  app.post(
    "/admin/brand",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        name: z.string().min(1),
        handle: z.string().min(1),
        desc: z.string().optional(),
        img: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const brandService = req.scope.resolve("brandService");
      brandService.addBrand(data).then((brand) => {
        return res.json(brand);
      });
    }
  );

  // UPDATE A BRAND
  app.options("/admin/brand/:id", cors(adminCorsOptions));
  app.post(
    "/admin/brand/:id",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        name: z.string().min(1),
        handle: z.string().min(1),
        desc: z.string().optional(),
        img: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const brandService = req.scope.resolve("brandService");
      brandService.updateBrand(req.params.id, data).then((brand) => {
        return res.json({ brand });
      });
    }
  );

  // DELETE A BRAND
  app.delete("/admin/brand/:id", cors(adminCorsOptions), async (req, res) => {
    const brandService = req.scope.resolve("brandService");
    brandService.deleteBrand(req.params.id).then(() => {
      return res.sendStatus(200);
    });
  });

  //DELETE A BRAND BY POST METHOD --- because useAdminCustomDelete did not get dynamic id on run time 
  app.options("/admin/delete-brand/", cors(adminCorsOptions));
  app.post(
    "/admin/delete-brand/",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        id: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const brandService = req.scope.resolve("brandService");
      brandService.deleteBrand(data.id)
      .then(() => {
        res.sendStatus(200); // Send a success status code
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          res.status(400).json({ error: error.response.data.message }); // Send a custom error response
        } else {
          res.status(500).json({ error: "An error occurred" }); // Send a generic error response
        }
      });
    })
  //end of APIs for brand---------------------

  //start of APIs for product-----------------

  // UPDATE A BRAND OF PRODUCT
  app.options("/admin/brand/product/:id", cors(adminCorsOptions));
  app.post(
    "/admin/brand/product/:id",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        brandId: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const productService = req.scope.resolve("productService");
      const manager = req.scope.resolve("manager");
      await manager.transaction(async (transactionManager) => {
        const productServiceTx =
          productService.withTransaction(transactionManager);
        const product = await productServiceTx.update(req.params.id, {
          brand: data.brandId,
        });
        return res.json({ product });
      });
    }
  );
  //end of APIs for product-------------------



  //start of APIs for contact-----------------

   //GET ALL CONTACTS ON STORE
   app.get("/store/contact", cors(storeCorsOptions), async (req, res) => {
    const contactService = req.scope.resolve("contactService");
    contactService.getContacts().then((contacts) => {
      const simplifiedContacts = contacts.map((contact) => ({
        title: contact.title,
        value: contact.value,
      }));
      return res.json(simplifiedContacts);
    });
  });

  // GET A SINGLE CONTACT BY TITLE ON STORE
  app.get(
    "/store/contact/:identifier",
    cors(storeCorsOptions),
    async (req, res) => {
      const contactService = req.scope.resolve("contactService");
      const identifier = req.params.identifier;

      contactService.getContactByTitle(identifier).then((contactByTitle) => {
        if (contactByTitle) {
          const { title, value } = contactByTitle;
        return res.json({ title, value });
        }else {
              return res.json({ message: "No record found" });
            }
        });
    }
  );

  // GET ALL CONTACT ON ADMIN
  app.options("/admin/contact", cors(adminCorsOptions), bodyParser.json());
  app.get("/admin/contact", cors(adminCorsOptions), async (req, res) => {
    const contactService = req.scope.resolve("contactService");
    contactService.getContacts().then((contact) => {
      return res.json({ contact });
    });
  });

  // GET A SINGLE CONTACT BY ID ON ADMIN
  app.get("/admin/contact/:id", cors(adminCorsOptions), async (req, res) => {
    const contactService = req.scope.resolve("contactService");
    contactService.getContactById(req.params.id).then((contact) => {
      return res.json({ contact });
    });
  });

  // ADD CONTACT
  app.options("/admin/contact", cors(adminCorsOptions), bodyParser.json());
app.post(
  "/admin/contact",
  cors(adminCorsOptions),
  bodyParser.json(),
  async (req, res) => {
    const schema = z.object({
        value: z.string().optional(),
        title: z.string().min(1),
      });

    /* @ts-ignore */
    const { success, error, data } = schema.safeParse(req.body);
    if (!success) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
    }

    const contactService = req.scope.resolve("contactService");
    contactService.addContact(data).then((contact) => {
      return res.json(contact);
    });
  }
);


  // UPDATE A CONTACT
  app.options("/admin/updateContact/", cors(adminCorsOptions));
  app.post(
    "/admin/updateContact/",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        id: z.string().optional(),
        value: z.string().optional(),
        title: z.string().min(1),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const contactService = req.scope.resolve("contactService");
      contactService.updateContact(data.id, data).then((contact) => {
        return res.json({ contact });
      });
    }
  );

  // DELETE A CONTACT BY ID
  app.delete("/admin/contact/:id", cors(adminCorsOptions), async (req, res) => {
    const contactService = req.scope.resolve("contactService");
    contactService.deleteContact(req.params.id).then(() => {
      return res.sendStatus(200);
    });
  });

  //DELETE A CONTACT BY POST METHOD --- because useAdminCustomDelete did not get dynamic id on run time 
  app.options("/admin/deleteContact/", cors(adminCorsOptions));
  app.post(
    "/admin/deleteContact/",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        id: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const contactService = req.scope.resolve("contactService");
      contactService.deleteContact(data.id).then((contact) => {
        return res.json({ contact });
      });
    }
  );
  //end of APIs for contacts-------------------

   //start of APIs for FAQs-----------------

   //GET ALL FAQs ON STORE
   app.get("/store/faqs", cors(storeCorsOptions), async (req, res) => {
    const faqService = req.scope.resolve("faqService");
    faqService.getfaqs().then((faqs) => {
      const simplifiedFaqs = faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }));
      return res.json(simplifiedFaqs);
    });
  });

  // GET A SINGLE FAQ BY TITLE ON STORE
  app.get(
    "/store/faqs/:identifier",
    cors(storeCorsOptions),
    async (req, res) => {
      const faqService = req.scope.resolve("faqService");
      const identifier = req.params.identifier;

      faqService.getFaqById(identifier).then((FaqById) => {
        if (FaqById) {
          const { question, answer } = FaqById;
        return res.json({ question, answer });
        }else {
              return res.json({ message: "No record found" });
            }
        });
    }
  );

  // GET ALL FAQs ON ADMIN
  app.options("/admin/faqs", cors(adminCorsOptions), bodyParser.json());
  app.get("/admin/faqs", cors(adminCorsOptions), async (req, res) => {
    const faqService = req.scope.resolve("faqService");
    faqService.getfaqs().then((faqs) => {
      return res.json({ faqs });
    });
  });

  // GET A SINGLE FAQ BY ID ON ADMIN
  app.get("/admin/faqs/:id", cors(adminCorsOptions), async (req, res) => {
    const faqService = req.scope.resolve("faqService");
    faqService.getFaqById(req.params.id).then((faq) => {
      return res.json({ faq });
    });
  });

  // ADD FAQs
  app.options("/admin/faqs", cors(adminCorsOptions), bodyParser.json());
app.post(
  "/admin/faqs",
  cors(adminCorsOptions),
  bodyParser.json(),
  async (req, res) => {
    const schema = z.object({
        question: z.string().optional(),
        answer: z.string().min(1),
      });

    /* @ts-ignore */
    const { success, error, data } = schema.safeParse(req.body);
    if (!success) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
    }

    const faqService = req.scope.resolve("faqService");
    faqService.addFaq(data).then((faq) => {
      return res.json(faq);
    });
  }
);


  // UPDATE A FAQ
  app.options("/admin/updateFaqs/", cors(adminCorsOptions));
  app.post(
    "/admin/updateFaqs/",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        id: z.string().optional(),
        question: z.string().optional(),
        answer: z.string().min(1),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const faqService = req.scope.resolve("faqService");
      faqService.updateFaq(data.id, data).then((faq) => {
        return res.json({ faq });
      });
    }
  );

  // DELETE A FAQ BY ID
  app.delete("/admin/faqs/:id", cors(adminCorsOptions), async (req, res) => {
    const faqService = req.scope.resolve("faqService");
    faqService.deleteFaq(req.params.id).then(() => {
      return res.sendStatus(200);
    });
  });

  //DELETE A FAQ BY POST METHOD --- because useAdminCustomDelete did not get dynamic id on run time 
  app.options("/admin/deleteFaq/", cors(adminCorsOptions));
  app.post(
    "/admin/deleteFaq/",
    cors(adminCorsOptions),
    bodyParser.json(),
    async (req, res) => {
      const schema = z.object({
        id: z.string().optional(),
      });
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body);
      if (!success) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
      }
      const faqService = req.scope.resolve("faqService");
      faqService.deleteFaq(data.id).then((faq) => {
        return res.json({ faq });
      });
    }
  );
  //end of APIs for FAQs-------------------

  return app;
};
