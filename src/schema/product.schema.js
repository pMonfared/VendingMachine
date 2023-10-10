/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         amountAvailable:
 *           type: number
 *           description: Amount of the product available
 *         cost:
 *           type: number
 *           description: Cost of the product
 *         productName:
 *           type: string
 *           description: Name of the product
 *       example:
 *         amountAvailable: 100
 *         cost: 50.99
 *         productName: Sample Product
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchaseResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the result of the purchase.
 *         userDeposit:
 *           type: number
 *           description: The user's deposit after the purchase.
 *         totalSpent:
 *           type: number
 *           description: The total amount spent on the purchase.
 *         productPurchased:
 *           type: object
 *           properties:
 *             productId:
 *               type: string
 *               description: The ID of the purchased product.
 *             productName:
 *               type: string
 *               description: The name of the purchased product.
 *             amountAvailable:
 *               type: number
 *               description: The amount available of the purchased product.
 *             quantity:
 *               type: number
 *               description: The quantity of the product purchased.
 *       example:
 *         message: Purchase successful
 *         userDeposit: 500.0
 *         totalSpent: 25.99
 *         productPurchased:
 *           productId: abc123
 *           productName: Sample Product
 *           amountAvailable: 75
 *           quantity: 1
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductSold:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           description: The ID of the purchased product.
 *         productName:
 *           type: string
 *           description: The name of the purchased product.
 *         quantity:
 *           type: number
 *           description: The quantity of the product purchased.
 *         price:
 *           type: number
 *           description: The price of the product.
 *         totalCost:
 *           type: number
 *           description: The total cost of the product (price * quantity).
 *       example:
 *         productId: abc123
 *         productName: Sample Product
 *         quantity: 1
 *         price: 25.99
 *         totalCost: 25.99
 */
