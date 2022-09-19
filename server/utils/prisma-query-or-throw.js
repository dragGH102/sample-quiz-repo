const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.prismaFindUniqueQueryOrThrow = async (condition, model) => {
    try {
        const result = await prisma[model].findUniqueOrThrow(condition);
        console.log('result', result);
        return result;
        // return await == Promise.resolve(result) if the function was not async
      }
      catch(e) {
         console.log('prismaFindUniqueQueryOrThrow error', e);
         throw e;
      }
};