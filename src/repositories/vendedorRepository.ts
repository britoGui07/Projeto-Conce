import { executarComandoSQL } from "../database/mysql"
import {Vendedor } from "../models/vendedor"

export class VendedorRepository{
    private static instance: VendedorRepository

    private constructor() {}

    static getInstance(): VendedorRepository {
        if(!this.instance) {
            this.instance = new VendedorRepository()
        }
        return this.instance
    }

    static getCreateTableQuery(): string {
        return `
        CREATE TABLE IF NOT EXISTS Vendedor (
        id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        matricula VARCHAR(20) NOT NULL UNIQUE,
        comissao_percentual DECIMAL (5,2) NOT NULL
        );
        `
    }

    async inserirVendedor(vendedor: Vendedor): Promise<Vendedor> {
        const resultado = await executarComandoSQL(
            'INSERT INTO Vendedor (nome, matricula, comissao_percentual) VALUES (?, ?, ?)',
            [vendedor.nome, vendedor.matricula, vendedor.comissao_percentual]
        )
        return new Vendedor(resultado.insertId, vendedor.nome, vendedor.matricula, vendedor.comissao_percentual)
    }

    async mostrarTodos(): Promise<Vendedor[]> {
        const linhas = await executarComandoSQL ('SELECT * FROM Vendedor', [])
        return linhas.map((l: any) => new Vendedor (l.id_vendedor, l.nome, l.matricula, Number (l.comissao_percentual)))
    }

    async buscarPorId(id: number): Promise<Vendedor | null> {
        const linhas = await executarComandoSQL('SELECT * FROM Vendedor WHERE id_vendedor = ?', [id])
        if(linhas.length ===0) return null
        const l = linhas[0]
        return new Vendedor(l.id_vendedor, l.nome, l.matricula, Number(l.comissao_percentual))
    }

    async buscarPorMatricula(matricula: string): Promise<Vendedor | null>{
        const linhas = await executarComandoSQL('SELECT * FROM Vendedor WHERE matricula=?', [matricula])
        if (linhas.length === 0) return null
        const l = linhas[0]
        return new Vendedor(l.id_vendedor, l.nome, l.matricula, Number (l.comissao_percentual))
    }
    
    async atualizarVendedor(id: number, vendedor: Vendedor): Promise<Vendedor | null> {
        await executarComandoSQL(
            'UPDATE Vendedor SET nome = ?, matricula = ?, comissao_percentual = ? WHERE id_vendedor =?',
            [vendedor.nome, vendedor.matricula, vendedor.comissao_percentual, id]
        )
        return this.buscarPorId(id)
    }

    async removerVendedor(id: number): Promise<boolean>{
        const resultado = await executarComandoSQL('DELETE FROM Vendedor WHERE id_vendedor= ?', [id])
        return resultado.affectedRows > 0
    }

    async listarNotasPorVendedor(id_vendedor: number): Promise<any[]> {
        const linhas = await executarComandoSQL(
            'SELECT * FROM NotaFiscal WHERE id_vendedor = ?',
            [id_vendedor]
        )
        return linhas
    }

    async vendedorPossuiNotas(id_vendedor: number): Promise<boolean> {
        const notas = await this.listarNotasPorVendedor(id_vendedor)
        return notas.length > 0
    }
}
