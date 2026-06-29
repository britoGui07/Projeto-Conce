import {executarComandoSQL} from "../database/mysql"
import {Carro} from "../models/carro"

export class CarroRepository{
    private static instance: CarroRepository

    private constructor() {}

    static getInstance(): CarroRepository{
        if(!this.instance){
            this.instance = new CarroRepository
        }
        return this.instance
    }

    static getCreateTableQuery(): string{
        return `
            CREATE TABLE IF NOT EXISTS Carro (
                id_carro INT AUTO_INCREMENT PRIMARY KEY,
                marca VARCHAR(100) NOT NULL,
                modelo VARCHAR(100) NOT NULL,
                ano INT NOT NULL,
                placa VARCHAR(20) NOT NULL UNIQUE,
                preco DECIMAL(10,2) NOT NULL,
                cor VARCHAR(50) NOT NULL
            );
        `
    }
    
    async inserirCarro(carro: Carro): Promise<Carro>{
        const resultado = await executarComandoSQL(
            'INSERT INTO Carro (marca, modelo, ano, placa, preco, cor) VALUES (?, ?, ?, ?, ?, ?)',
            [carro.marca, carro.modelo, carro.ano, carro.placa, carro.preco, carro.cor]
        )
        return new Carro(resultado.insertId, carro.marca, carro.modelo, carro.ano, carro.placa, carro.preco, carro.cor)
    }

    async mostrarTodos(): Promise<Carro[]>{
        const linhas = await executarComandoSQL('SELECT * FROM Carro', [])
        return linhas.map((l: any) => new Carro(l.id_carro, l.marca, l.modelo, l.ano, l.placa, Number(l.preco), l.cor))
    }

    async buscarPorId(id: number): Promise<Carro | null>{
        const linhas = await executarComandoSQL('SELECT * FROM Carro WHERE id_carro = ?', [id])
        if(linhas.length === 0) return null
        const l = linhas[0]
        return new Carro(l.id_carro, l.marca, l.modelo, l.ano, l.placa, Number(l.preco), l.cor)
    }

    async buscarPelaPlaca(placa: string): Promise<Carro | null>{
        const linhas = await executarComandoSQL('SELECT * FROM Carro WHERE placa = ?', [placa])
        if (linhas.length === 0) return null
        const l = linhas[0]
        return new Carro(l.id_carro, l.marca, l.modelo, l.ano, l.placa, Number(l.preco), l.cor)
    }

    async atualizarCarro(id: number, carro: Carro): Promise<Carro | null>{
        await executarComandoSQL(
            'UPDATE Carro SET marca = ?, modelo = ?, ano = ?, placa = ?, preco = ?, cor = ? WHERE id_carro = ?', 
            [carro.marca, carro.modelo, carro.ano, carro.placa, carro.preco, carro.cor, id]
        )
        return this.buscarPorId(id)
    }

    async removerCarro(id: number): Promise<boolean>{
        const resultado = await executarComandoSQL('DELETE FROM Carro WHERE id_carro = ?', [id])
        return resultado.affectedRows > 0
    }
}