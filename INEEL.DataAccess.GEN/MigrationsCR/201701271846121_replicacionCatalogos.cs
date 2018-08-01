namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class replicacionCatalogos : DbMigration
    {
        public override void Up()
        {
            DropIndex("CR.cat_TipoOrganizacion", new[] { "Nombre" });
            DropIndex("CR.cat_TipoConvenio", new[] { "NomTipConv" });
            DropIndex("CR.cat_LineaDesarrolloTecnologico", new[] { "NomLinDesTec" });
            DropIndex("CR.cat_Producto", new[] { "NomProd" });
            DropIndex("CR.cat_SegmentoMercado", new[] { "NomSegMerc" });
            DropIndex("CR.cat_Servicio", new[] { "NomServ" });
            DropIndex("CR.cat_TamanoEmpresa", new[] { "NomTamEmp" });
            DropIndex("CR.cat_TipoFuentesFinanciamiento", new[] { "Nombre" });
            DropIndex("CR.cat_Tematicas", new[] { "Nombre" });
            DropIndex("CR.cat_AreaInvestigacion", new[] { "Nombre" });
            DropIndex("CR.cat_NaturalezaInteraccion", new[] { "Nombre" });
            DropIndex("CR.tab_Proveedor", new[] { "Nombre" });
            DropIndex("CR.cat_TipoRelacion", new[] { "Nombre" });
            DropIndex("CR.cat_TipoProductoServicio", new[] { "Nombre" });
        }
        
        public override void Down()
        {
            CreateIndex("CR.cat_TipoProductoServicio", "Nombre", unique: true);
            CreateIndex("CR.cat_TipoRelacion", "Nombre", unique: true);
            CreateIndex("CR.tab_Proveedor", "Nombre", unique: true);
            CreateIndex("CR.cat_NaturalezaInteraccion", "Nombre", unique: true);
            CreateIndex("CR.cat_AreaInvestigacion", "Nombre", unique: true);
            CreateIndex("CR.cat_Tematicas", "Nombre", unique: true);
            CreateIndex("CR.cat_TipoFuentesFinanciamiento", "Nombre", unique: true);
            CreateIndex("CR.cat_TamanoEmpresa", "NomTamEmp", unique: true);
            CreateIndex("CR.cat_Servicio", "NomServ", unique: true);
            CreateIndex("CR.cat_SegmentoMercado", "NomSegMerc", unique: true);
            CreateIndex("CR.cat_Producto", "NomProd", unique: true);
            CreateIndex("CR.cat_LineaDesarrolloTecnologico", "NomLinDesTec", unique: true);
            CreateIndex("CR.cat_TipoConvenio", "NomTipConv", unique: true);
            CreateIndex("CR.cat_TipoOrganizacion", "Nombre", unique: true);
        }
    }
}
