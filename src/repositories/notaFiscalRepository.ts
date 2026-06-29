import {executarComandoSQL} from "../database/mysql";
import {NotaFiscal} from "../models/notaFiscal";

export class NotaFiscalRepository{
    private static instance: NotaFiscalRepository

    private constructor() {}

    static getInstance(): NotaFiscalRepository{
        if(!this.instance){
            this.instance = new NotaFiscalRepository()
        }
        return this.instance
    }

    static getCreateTableQuery(): string{
        return `
            CREATE TABLE IF NOT EXISTS NotaFiscal (
                id_nota INT AUTO_INCREMENT PRIMARY KEY,
                numero_nota VARCHAR(50) NOT NULL UNIQUE,
                data_emissao DATE NOT NULL,
                valor_total DECIMAL(10,2) NOT NULL,
                id_cliente INT NOT NULL,
                id_vendedor INT NOT NULL,
                id_carro INT NOT NULL,
                FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
                FOREIGN KEY (id_vendedor) REFERENCES Vendedor(id_vendedor),
                FOREIGN KEY (id_carro) REFERENCES Carro(id_carro)
            );
        `
    }

    async inserirNota(nota: NotaFiscal): Promise<NotaFiscal>{
        const resultado = await executarComandoSQL(
            'INSERT INTO NotaFiscal (numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro) VALUES (?, ?, ?, ?, ?, ?)',
            [nota.numero_nota, nota.data_emissao, nota.valor_total, nota.id_cliente, nota.id_vendedor, nota.id_carro]
        )
        return new NotaFiscal(resultado.insertId, nota.numero_nota, nota.data_emissao, nota.valor_total, nota.id_cliente, nota.id_vendedor, nota.id_carro)
    }

    async mostrarTodos(): Promise<NotaFiscal[]>{
        const linhas = await executarComandoSQL('SELECT * FROM NotaFiscal', [])
        return linhas.map((l: any) => new NotaFiscal(l.id_nota, l.numero_nota, l.data_emissao, l.valor_total, l.id_cliente, l.id_vendedor, l.id_carro))
    }

    async buscarPorId(id: number): Promise<NotaFiscal | null>{
        const linhas = await executarComandoSQL('SELECT * FROM NotaFiscal WHERE id_nota = ?', [id])
        if(linhas.length === 0) return null
        const l = linhas[0]
        return new NotaFiscal(l.id_nota, l.numero_nota, l.data_emissao, l.valor_total, l.id_cliente, l.id_vendedor, l.id_carro)
    }

    async buscarPorIdCliente(id_cliente: number): Promise<NotaFiscal[]>{
        const linhas = await executarComandoSQL('SELECT * FROM NotaFiscal WHERE id_cliente = ?', [id_cliente])
        return linhas.map((l: any) => new NotaFiscal(l.id_nota, l.numero_nota, l.data_emissao, l.valor_total, l.id_cliente, l.id_vendedor, l.id_carro))
    }

    async buscarPorIdVendedor(id_vendedor: number): Promise<NotaFiscal[]>{
        const linhas = await executarComandoSQL('SELECT * FROM NotaFiscal WHERE id_vendedor = ?', [id_vendedor])
        return linhas.map((l: any) => new NotaFiscal(l.id_nota, l.numero_nota, l.data_emissao, l.valor_total, l.id_cliente, l.id_vendedor, l.id_carro))
    }

    async buscarPorIdCarro(id_carro: number): Promise<NotaFiscal | null>{
        const linhas = await executarComandoSQL('SELECT * FROM NotaFiscal WHERE id_carro = ?', [id_carro])
        if(linhas.length === 0) return null
        const l = linhas[0]
        return new NotaFiscal(l.id_nota, l.numero_nota, l.data_emissao, l.valor_total, l.id_cliente, l.id_vendedor, l.id_carro)
    }

    async buscarPeloNumero(numero_nota: string): Promise<NotaFiscal | null>{
        const linhas = await executarComandoSQL('SELECT * FROM NotaFiscal WHERE numero_nota = ?', [numero_nota])
        if(linhas.length === 0) return null
        const l = linhas[0]
        return new NotaFiscal(l.id_nota, l.numero_nota, l.data_emissao, l.valor_total, l.id_cliente, l.id_vendedor, l.id_carro)
    }
}