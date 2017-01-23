import { IProductRepository } from "../domain/entity/IProductRepository";
import { Product } from "../domain/entity/Product";
import { File } from "../domain/valueObject/File";
import { shopContainer } from "../module/shopContainer";
import { TYPES } from "../module/types";

const file = new File("big_buck_bunny.mp4");
const file2 = new File("barcelona.mp4");
const productRepository = shopContainer.get<IProductRepository>(TYPES.IProductRepository);
const product = new Product(
    productRepository.getNextId(),
    "Test product",
    10.00,
);
product.addDemoFile(file);
product.addFileAvailableAfterPurchase(file2);

function fixtures() {
    return productRepository.add(product);
};

export { fixtures };
