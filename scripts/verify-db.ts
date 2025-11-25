import { checkConnection, query } from "../lib/postgres"

async function main() {
    console.log("Verificando conexão com o banco de dados...")
    const connectionResult = await checkConnection()

    if (connectionResult.success) {
        console.log("✅ Conexão estabelecida com sucesso!")

        console.log("Listando tabelas...")
        try {
            const result = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `)

            console.log("Tabelas encontradas:")
            result.rows.forEach((row: any) => {
                console.log(`- ${row.table_name}`)
            })

        } catch (error) {
            console.error("Erro ao listar tabelas:", error)
        }

    } else {
        console.error("❌ Falha na conexão:", connectionResult.message)
    }

    process.exit(0)
}

main().catch(console.error)
