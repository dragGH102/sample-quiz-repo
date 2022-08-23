const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function main() {
    const sampleQuestion = await prisma.question.create({
        data: {
            label: "Which one is not a crypto currency?",
            answers: {
              create: [
                { label: "Bitcoin" },
                { label: "USDT" },
                {
                    label: "USD",
                    status: true
                },
                {
                  label: "None of the above."
                }
              ]
            }
        }
    })
    console.log('Created New Questions: ', sampleQuestion);

    const allQuestions = await prisma.question.findMany({
        include: { answers: true}
    })
    console.log('All Questions: ')
    console.dir(allQuestions, { depth: null })


    // console.log('Star seeding .... ... ')
    // for (let nq of newQuestion) {
    //     const quest = await prisma.question.create({
    //         data: [nq],
    //     })
    //     console.log(`Created Question with id: ${quest.id}`)
    // }
    // console.log(`Seeding finished.`)

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })