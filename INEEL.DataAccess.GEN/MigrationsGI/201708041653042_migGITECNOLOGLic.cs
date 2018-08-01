namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migGITECNOLOGLic : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.cat_EstadoLicenciamiento",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Descripcion = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "GI.tab_TecnologiaLicenciada",
                c => new
                    {
                        TecnologiaLicenciadaId = c.Int(nullable: false, identity: true),
                        Numero = c.Int(),
                        NombreTecnologiaLic = c.String(nullable: false),
                        FechaInicio = c.DateTime(),
                        FechaTermino = c.DateTime(),
                        EstadoLicenciamientoId = c.Int(nullable: false),
                        ProductoId = c.Int(),
                        ProyectoId = c.String(maxLength: 10),
                        AliadoId = c.Int(),
                        NombreReceptor = c.String(),
                    })
                .PrimaryKey(t => t.TecnologiaLicenciadaId)
                .ForeignKey("CR.tab_Aliado", t => t.AliadoId)
                .ForeignKey("GI.cat_EstadoLicenciamiento", t => t.EstadoLicenciamientoId, cascadeDelete: true)
                .ForeignKey("GI.tab_Producto", t => t.ProductoId)
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId)
                .Index(t => t.Numero, unique: true)
                .Index(t => t.EstadoLicenciamientoId)
                .Index(t => t.ProductoId)
                .Index(t => t.ProyectoId)
                .Index(t => t.AliadoId);
            
            CreateTable(
                "GI.tab_TecnologiaLicenciadaGerencia",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaveUnidad = c.String(nullable: false, maxLength: 10),
                        Principal = c.Boolean(),
                        TecnologiaLicenciadaId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.tab_TecnologiaLicenciada", t => t.TecnologiaLicenciadaId, cascadeDelete: true)
                .Index(t => t.TecnologiaLicenciadaId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_TecnologiaLicenciada", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("GI.tab_TecnologiaLicenciada", "ProductoId", "GI.tab_Producto");
            DropForeignKey("GI.tab_TecnologiaLicenciadaGerencia", "TecnologiaLicenciadaId", "GI.tab_TecnologiaLicenciada");
            DropForeignKey("GI.tab_TecnologiaLicenciada", "EstadoLicenciamientoId", "GI.cat_EstadoLicenciamiento");
            DropForeignKey("GI.tab_TecnologiaLicenciada", "AliadoId", "CR.tab_Aliado");
            DropIndex("GI.tab_TecnologiaLicenciadaGerencia", new[] { "TecnologiaLicenciadaId" });
            DropIndex("GI.tab_TecnologiaLicenciada", new[] { "AliadoId" });
            DropIndex("GI.tab_TecnologiaLicenciada", new[] { "ProyectoId" });
            DropIndex("GI.tab_TecnologiaLicenciada", new[] { "ProductoId" });
            DropIndex("GI.tab_TecnologiaLicenciada", new[] { "EstadoLicenciamientoId" });
            DropIndex("GI.tab_TecnologiaLicenciada", new[] { "Numero" });
            DropTable("GI.tab_TecnologiaLicenciadaGerencia");
            DropTable("GI.tab_TecnologiaLicenciada");
            DropTable("GI.cat_EstadoLicenciamiento");
        }
    }
}
