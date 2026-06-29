import { executarComandoSQL } from "../database/mysql"
import {Estoque} from "../models/estoque"

export class EstoqueRepository{
    private static instance: EstoqueRepository

    private constructor() {}

    static getInstance(): EstoqueRepository{
        if(!this.instance){
            this.instance = new EstoqueRepository
        }
        return this.instance
    }

    static getCreateTableQuery(): string{
        return `
            CREATE TABLE IF NOT EXISTS Estoque (
                id_estoque INT AUTO_INCREMENT PRIMARY KEY,
                id_carro INT NOT NULL UNIQUE,
                quantidade INT NOT NULL,
                localizacao_patio VARCHAR(100) NOT NULL,
                data_entrada DATE NOT NULL,
                FOREIGN KEY (id_carro) REFERENCES Carro(id_carro)
            );
        `
    }

    async inserirEstoque(estoque: Estoque): Promise<Estoque>{
        const resultado = await executarComandoSQL(
            'INSERT INTO Estoque (id_carro, quantidade, localizacao_patio, data_entrada) VALUES (?, ?, ?, ?)',
            [estoque.id_carro, estoque.quantidade, estoque.localizacao_patio, estoque.data_entrada]
        )
        return new Estoque(resultado.insertId, estoque.id_carro, estoque.quantidade, estoque.localizacao_patio, estoque.data_entrada)
    }

    async mostrarTodos(): Promise<Estoque[]>{
        const linhas = await executarComandoSQL('SELECT * FROM Estoque', [])
        return linhas.map((l: any) => new Estoque(l.id_estoque, l.id_carro, l.quantidade, l.localizacao_patio, l.data_entrada))
    }

    async buscarPorId(id: number): Promise<Estoque | null>{
        const linhas = await executarComandoSQL('SELECT * FROM Estoque WHERE id_estoque = ?', [id])
        if(linhas.length === 0) return null
        const l = linhas[0]
        return new Estoque(l.id_estoque, l.id_carro, l.quantidade, l.localizacao_patio, l.data_entrada)
    }

    async buscarPorIdCarro(id_carro: number): Promise<Estoque | null>{
        const linhas = await executarComandoSQL('SELECT * FROM Estoque WHERE id_carro = ?', [id_carro])
        if(linhas.length === 0) return null
        const l = linhas[0]
        return new Estoque(l.id_estoque, l.id_carro, l.quantidade, l.localizacao_patio, l.data_entrada)
    }

    async buscarCarrosDisponiveis(): Promise<number[]>{
        const linhas = await executarComandoSQL('SELECT id_carro FROM Estoque WHERE quantidade > 0', [])
        return linhas.map((l: any) => l.id_carro)
    }

    async atualizarEstoque(id: number, quantidade?: number, localizacao_patio?: string): Promise<Estoque | null>{
        const estoque = await this.buscarPorId(id)
        if(!estoque) return null

        const novaQuantidade = quantidade !== undefined ? quantidade : estoque.quantidade
        const novaLocalizacao = localizacao_patio ?? estoque.localizacao_patio

        await executarComandoSQL(
            'UPDATE Estoque SET quantidade = ?, localizacao_patio = ? WHERE id_estoque = ?',
            [novaQuantidade, novaLocalizacao, id]
        )
        return this.buscarPorId(id)
    }

    async removerEstoque(id: number): Promise<boolean>{
        const resultado = await executarComandoSQL('DELETE FROM Estoque WHERE id_estoque = ?', [id])
        return resultado.affectedRows > 0
    }
}