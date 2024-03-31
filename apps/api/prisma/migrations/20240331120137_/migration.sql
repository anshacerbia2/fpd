/*
  Warnings:

  - You are about to drop the column `discountName` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `limit` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `maxDiscountValue` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `minPurchaseAmount` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `usage` on the `discount` table. All the data in the column will be lost.
  - Made the column `productId` on table `discount` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `discount` DROP FOREIGN KEY `Discount_productId_fkey`;

-- AlterTable
ALTER TABLE `discount` DROP COLUMN `discountName`,
    DROP COLUMN `limit`,
    DROP COLUMN `maxDiscountValue`,
    DROP COLUMN `minPurchaseAmount`,
    DROP COLUMN `status`,
    DROP COLUMN `usage`,
    MODIFY `productId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
