import {executarComandoSQL} from "../database/mysql";
import {Cliente } from "../models/cliente"

export class ClienteRepository{
    private static instance: ClienteRepository
    
    private constructor(){}

    static getInstance(): ClienteRepository{
        if (!this.instance){
            this.instance = new ClienteRepository
        }
        return this.instance
    }

    static getCreateTableQuery(): string{
        return `
        CREATE TABLE IF NOT EXISTS Cliente(
            id_cliente INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            cpf VARCHAR(14) NOT NULL UNIQUE,
            telefone VARCHAR(20) NOT NULL,
            email VARCHAR(100),
            cidade VARCHAR(100)
            );
        `
    }

    async inserirCliente(cliente: Cliente): Promise<Cliente> {
        const resultado = await executarComandoSQL(
            'INSERT INTO Cliente (nome, cpf, telefone, email, cidade) VALUES (?, ?, ?, ?, ?)',
            [cliente.nome, cliente.cpf, cliente.telefone, cliente.email ?? null, cliente.cidade ?? null]
        )
        return new Cliente(resultado.insertId, cliente.nome, cliente.cpf, cliente.telefone, cliente.email, cliente.cidade)
    }
    
    async mostrarTodos(): Promise<Cliente[]> {
        const linhas = await executarComandoSQL('SELECT * FROM Cliente', [])
        return linhas.map((l: any) => new Cliente(l.id_cliente, l.nome, l.cpf, l.telefone, l.email, l.cidade))
    }
    
    async buscarPorId(id: number): Promise<Cliente | null> {
        const linhas = await executarComandoSQL('SELECT * FROM Cliente WHERE id_cliente = ?', [id])
        if (linhas.length ===0) return null
        const l = linhas [0]
        return new Cliente(l.id_cliente, l.nome, l.cpf, l.telefone, l.email, l.cidade)
    }
    async buscarPorCPF(cpf: string): Promise<Cliente | null>{
        const linhas = await executarComandoSQL('SELECT * FROM Cliente WHERE cpf = ?', [cpf])
        if (linhas.length === 0) return null
        const l = linhas[0]
        return new Cliente(l.id_cliente, l.nome, l.cpf, l.telefone, l.email, l.cidade)
    }

    async atualizarCliente(id: number, cliente: Cliente): Promise<Cliente | null> {
        await executarComandoSQL(
            'UPDATE Cliente SET nome= ?, cpf=?, telefone= ?, email= ?, cidade= ? WHERE id_cliente = ?',
            [cliente.nome, cliente.cpf, cliente.telefone, cliente.email ?? null, cliente.cidade ?? null, id]
        )
        return this.buscarPorId(id)
    }

    async removerCliente(id: number): Promise<boolean> {
        const resultado = await executarComandoSQL('DELETE FROM Cliente WHERE id_cliente =?', [id])
        return resultado.affectedRows > 0
    }

    async listarNotasPorCliente(id_cliente: number): Promise<any[]> {
        const linhas = await executarComandoSQL(
            'SELECT * FROM NotaFiscal WHERE id_cliente = ?',
            [id_cliente]
        )
        return linhas
    }

    async clientePossuiNotas(id_cliente: number): Promise<boolean>{
        const notas = await this.listarNotasPorCliente(id_cliente)
        return notas.length > 0
    }
}
