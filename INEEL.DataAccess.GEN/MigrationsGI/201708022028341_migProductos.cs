namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migProductos : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.cat_FactorInnovacion",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Valor = c.Single(nullable: false),
                        Descripcion = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "GI.tab_ProductoAutores",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(maxLength: 10),
                        Nombre = c.String(),
                        ProductoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.tab_Producto", t => t.ProductoId, cascadeDelete: true)
                .Index(t => t.ProductoId);
            
            CreateTable(
                "GI.tab_Producto",
                c => new
                    {
                        ProductoId = c.Int(nullable: false, identity: true),
                        ProyectoId = c.String(maxLength: 10),
                        UnidadOrganizacionalId = c.String(maxLength: 10),
                        NombreTecnico = c.String(),
                        NombreComercial = c.String(),
                        Necesidades = c.String(),
                        SegmentoMercadoId = c.Int(nullable: false),
                        Descripcion = c.String(),
                        FactorInnovacionId = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(),
                        ClavePersona = c.String(),
                        EstadoFlujoId = c.Int(nullable: false),
                        TipoAcceso = c.Int(nullable: false),
                        FechaValidacion = c.DateTime(),
                    })
                .PrimaryKey(t => t.ProductoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .ForeignKey("GI.cat_FactorInnovacion", t => t.FactorInnovacionId, cascadeDelete: true)
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId)
                .ForeignKey("CR.cat_SegmentoMercado", t => t.SegmentoMercadoId, cascadeDelete: true)
                .ForeignKey("GI.cat_TipoAcceso", t => t.TipoAcceso, cascadeDelete: true)
                .Index(t => t.ProyectoId)
                .Index(t => t.SegmentoMercadoId)
                .Index(t => t.FactorInnovacionId)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.TipoAcceso);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_Producto", "TipoAcceso", "GI.cat_TipoAcceso");
            DropForeignKey("GI.tab_Producto", "SegmentoMercadoId", "CR.cat_SegmentoMercado");
            DropForeignKey("GI.tab_Producto", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("GI.tab_ProductoAutores", "ProductoId", "GI.tab_Producto");
            DropForeignKey("GI.tab_Producto", "FactorInnovacionId", "GI.cat_FactorInnovacion");
            DropForeignKey("GI.tab_Producto", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_Producto", new[] { "TipoAcceso" });
            DropIndex("GI.tab_Producto", new[] { "EstadoFlujoId" });
            DropIndex("GI.tab_Producto", new[] { "FactorInnovacionId" });
            DropIndex("GI.tab_Producto", new[] { "SegmentoMercadoId" });
            DropIndex("GI.tab_Producto", new[] { "ProyectoId" });
            DropIndex("GI.tab_ProductoAutores", new[] { "ProductoId" });
            DropTable("GI.tab_Producto");
            DropTable("GI.tab_ProductoAutores");
            DropTable("GI.cat_FactorInnovacion");
        }
    }
}
