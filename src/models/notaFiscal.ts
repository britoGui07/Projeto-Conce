export class NotaFiscal{
    constructor(
        public id_nota: number | null,
        public numero_nota: string,
        public data_emissao: string,
        public valor_total: number,
        public id_cliente: number,
        public id_vendedor: number,
        public id_carro: number
    ){}
}