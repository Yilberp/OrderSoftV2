const { Categoria } = require("../repository/database/index").models;

module.exports = {
    create: async (categoria) => {
        const categoriaDB = await Categoria.create({ nombre: categoria.nombre});
        return categoriaDB;
    },
    delete: async (id) => { 
        const categoria = await Categoria.findByPk(id);
        if(categoria){
            categoria.destroy();
            return categoria;
        }
        return false;
    },
    update: async (categoria) =>{
        const { id, nombre } = categoria;
        const categoriaDB = await Categoria.findByPk(id);
        if(categoriaDB) {
            categoriaDB.nombre = nombre;
            categoriaDB.save();
            return categoria;
        }
        return false;
    },
    getById: async (id) => await Categoria.findByPk(id),
    getCategorias: async () => await Categoria.findAll(),
};
