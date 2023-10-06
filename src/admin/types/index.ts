import {AdminPostProductsProductReq} from '@medusajs/medusa'

export interface AdminPostProductsProductBrandReq extends AdminPostProductsProductReq {
    brandId: any
}
export type AdminPostProductsProductBrandRes={

}
export type AdminStaticPageReq = {
    handle: string
    title: string
    metadata: string | null
    body: string | null
};

export type AdminStaticPageDel = {
    id: string
};

export type AdminBrandReq = {
    name: string
    handle: string
    desc: string | null
    img: string | null
};

export type AdminContactReq = {
    title: string
    value: string
}

export type AdminBrandDel = {
    id: string
};

export type AdminContactUpdate = {
    id: string
    title: string
    value: string
}

export type AdminContactDel = {
    id:string
}
export type AdminStaticPageRes = {

};

export type AdminBrandRes = {

};

export type AdminContactRes = {

}

export type AdminFAQsReq = {
    question: string
    answer: string
}

export type AdminFAQsUpdate = {
    id: string
    question: string
    answer: string
}

export type AdminFAQsDel = {
    id:string
}

export type AdminFAQsRes = {

}