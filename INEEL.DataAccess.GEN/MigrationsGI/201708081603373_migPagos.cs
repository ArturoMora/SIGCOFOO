namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migPagos : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_TecnologiaLicenciadaPagos",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Fecha = c.DateTime(nullable: false),
                        TipoPagosId = c.Int(nullable: false),
                        Descripcion = c.String(),
                        Monto = c.Single(nullable: false),
                        TecnologiaLicenciadaId = c.Int(nullable: false),
                        ClavePersona = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.tab_TecnologiaLicenciada", t => t.TecnologiaLicenciadaId, cascadeDelete: true)
                .ForeignKey("GI.cat_TipoPagos", t => t.TipoPagosId, cascadeDelete: true)
                .Index(t => t.TipoPagosId)
                .Index(t => t.TecnologiaLicenciadaId);
            
            CreateTable(
                "GI.cat_TipoPagos",
                c => new
                    {
                        TipoPagosId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TipoPagosId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_TecnologiaLicenciadaPagos", "TipoPagosId", "GI.cat_TipoPagos");
            DropForeignKey("GI.tab_TecnologiaLicenciadaPagos", "TecnologiaLicenciadaId", "GI.tab_TecnologiaLicenciada");
            DropIndex("GI.tab_TecnologiaLicenciadaPagos", new[] { "TecnologiaLicenciadaId" });
            DropIndex("GI.tab_TecnologiaLicenciadaPagos", new[] { "TipoPagosId" });
            DropTable("GI.cat_TipoPagos");
            DropTable("GI.tab_TecnologiaLicenciadaPagos");
        }
    }
}
