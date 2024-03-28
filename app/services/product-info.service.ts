import prisma from "~/db.server";
import { findStoreByURL } from "../services/store-info.service";
import { ProductInfoDTO } from "~/dto/product-info.dto";
import { createAdminApiClient } from '@shopify/admin-api-client';
import { authenticate } from "../shopify.server";
import { parsePrice } from "~/utils/app.util";
import { json } from "@remix-run/node";

const findAll = async (param: Partial<ProductInfoDTO>) => {
    return await prisma.productInfo.findMany({
        where: {
            inStock: param.inStock,
            store: {
                shopifyURL: param.shopifyURL
            },
            NOT: {
                customerSubscription: {
                    none: {}
                }
            }
        },
        include: {
            customerSubscription: {
            }
        }
    });
};

const findSubscribedProducts = async (
  param: Partial<ProductInfoDTO>,
  page: number = 2,
  pageSize: number = 10
) => {
    BigInt.prototype.toJSON = function () {
        return this.toString();
    };
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    let d = await prisma.productInfo.findMany({
        where: {
            store: {
                shopifyURL: param.shopifyURL
            },
            NOT: {
                customerSubscription: {
                    none: {}
                }
            }
        },
        include: {
            customerSubscription: {
            }
        },
        skip: offset,
        take: limit
    });
    console.log(d);
    return d;
};


const isProductAlreadyAdded = async (productId: any, variantId: any) => {
    let count = await countProductAndVariantId(productId, variantId);
    return count > 0;
};

const countProductAndVariantId = async (productId: any, variantId: any) => {
    return await prisma.productInfo.count({
        where: {
            productId: productId,
            variantId: variantId
        }
    });
};


const findByProductAndVariantId = async (productId: any, variantId: any) => {
    return await prisma.productInfo.findFirst({
        where: {
            productId: productId,
            variantId: variantId
        }
    });
};

const addProductInfo = async (prodInfo: ProductInfoDTO) => {
    let storeInfo = await findStoreByURL(prodInfo.shopifyURL);
    return await prisma.productInfo.upsert({
        where: {
            productId_variantId: {
                productId: prodInfo.productId!,
                variantId: prodInfo.variantId!
            }
        },
        update: {
            productTitle: prodInfo.productTitle,
            variantTitle: prodInfo.variantTitle,
            imageURL: prodInfo.imageURL,
            price: parsePrice(prodInfo.price),
            status: true,
            inStock: false,
            updatedAt: new Date(),
            isActive: true,
        },
        create: {
            productHandle: prodInfo.productHandle!,
            productId: prodInfo.productId!,
            productTitle: prodInfo.productTitle!,
            variantId: prodInfo.variantId!,
            variantTitle: prodInfo.variantTitle!,
            imageURL: prodInfo.imageURL,
            price: parsePrice(prodInfo.price),
            status: true,
            inStock: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            store: {
                connect: {
                    id: storeInfo?.id
                }
            }

        }
    });
}

const upsertProduct = async (req: any, store: string) => {
    let prodcutInfos = [] as any[];
    req.variants.forEach((elm: any) => {
        if (elm.inventory_policy == 'deny')
            prodcutInfos.push({
                productId: elm.product_id + "",
                productTitle: req.title,
                productHandle: req.handle,
                variantId: elm.id + "",
                variantTitle: elm.title,
                price: parsePrice(elm.price),
                imageURL: req.image?.src,
                status: true,
                inStock: elm.inventory_quantity > 0 ? true : false,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: req.status == 'active' ? true : false,
            })
    });
    let storeInfo = await findStoreByURL(store);
    prodcutInfos.forEach(async elm => {
        console.log(elm)
        return await prisma.productInfo.upsert({
            where: {
                productId_variantId: {
                    productId: elm.productId,
                    variantId: elm.variantId,
                }
            },
            update: {
                productTitle: elm.productTitle,
                variantTitle: elm.variantTitle,
                imageURL: elm.imageURL,
                price: parsePrice(elm.price),
                status: true,
                inStock: elm.inStock,
                updatedAt: new Date(),
                isActive: true,
            },
            create: {
                productHandle: elm.productHandle,
                productId: elm.productId,
                productTitle: elm.productTitle,
                variantId: elm.variantId,
                variantTitle: elm.variantTitle,
                imageURL: elm.imageURL,
                price: parsePrice(elm.price),
                status: true,
                inStock: elm.inStock,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                store: {
                    connect: {
                        id: storeInfo?.id
                    }
                }

            }
        });

    })
    return prodcutInfos;
};

const findProductByIdShopify = async (request: Request) => {
    let { session } = await authenticate.admin(request);
    const client = createAdminApiClient({
        storeDomain: session.shop,
        apiVersion: '2024-01',
        accessToken: session.accessToken,
    });
    const operation = `
      query ProductQuery($id: ID!) {
        product(id: $id) {
          id
          title
          handle
        }
      }
    `;
    const { data, errors, extensions } = await client.request(operation, {
        variables: {
            id: 'gid://shopify/Product/8339514851618',
        },
    });
    return data;
}

export { findAll, upsertProduct, addProductInfo, findByProductAndVariantId, countProductAndVariantId, isProductAlreadyAdded, findSubscribedProducts }
