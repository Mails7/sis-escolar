import { initializeDatabase, seedDatabase } from "../lib/init-db"

async function main() {
    console.log("=".repeat(60))
    console.log("INICIALIZAÇÃO DO BANCO DE DADOS")
    console.log("=".repeat(60))

    // Criar schema
    const schemaResult = await initializeDatabase()
    if (!schemaResult.success) {
        console.error("\n❌ Falha ao criar schema. Abortando...")
        process.exit(1)
    }

    // Popular com dados
    const seedResult = await seedDatabase()
    if (!seedResult.success) {
        console.error("\n❌ Falha ao popular banco de dados. Abortando...")
        process.exit(1)
    }

    console.log("\n" + "=".repeat(60))
    console.log("✅ BANCO DE DADOS INICIALIZADO COM SUCESSO!")
    console.log("=".repeat(60))
    process.exit(0)
}

main()
