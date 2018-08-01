namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migModelSolicitud : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_ProductoGISolicitud",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ProductoId = c.Int(nullable: false),
                        ComentatriosSolicitante = c.String(),
                        ComentatriosComite = c.String(),
                        Innovacion = c.String(),
                        Superior = c.String(),
                        Fase = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.tab_Producto", t => t.ProductoId, cascadeDelete: true)
                .Index(t => t.ProductoId);
            
            CreateTable(
                "GI.tab_ProductoGISolicitudArchivosInnovacion",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Fecha = c.DateTime(nullable: false),
                        AdjuntoId = c.Long(nullable: false),
                        ProductoGISolicitudId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("GI.tab_ProductoGISolicitud", t => t.ProductoGISolicitudId, cascadeDelete: true)
                .Index(t => t.AdjuntoId)
                .Index(t => t.ProductoGISolicitudId);
            
            CreateTable(
                "GI.tab_ProductoGISolicitudArchivosFase",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Fecha = c.DateTime(nullable: false),
                        AdjuntoId = c.Long(nullable: false),
                        ProductoGISolicitudId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("GI.tab_ProductoGISolicitud", t => t.ProductoGISolicitudId, cascadeDelete: true)
                .Index(t => t.AdjuntoId)
                .Index(t => t.ProductoGISolicitudId);
            
            CreateTable(
                "GI.tab_ProductoGISolicitudArchivosSuperior",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Fecha = c.DateTime(nullable: false),
                        AdjuntoId = c.Long(nullable: false),
                        ProductoGISolicitudId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
                .ForeignKey("GI.tab_ProductoGISolicitud", t => t.ProductoGISolicitudId, cascadeDelete: true)
                .Index(t => t.AdjuntoId)
                .Index(t => t.ProductoGISolicitudId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_ProductoGISolicitudArchivosSuperior", "ProductoGISolicitudId", "GI.tab_ProductoGISolicitud");
            DropForeignKey("GI.tab_ProductoGISolicitudArchivosSuperior", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("GI.tab_ProductoGISolicitudArchivosFase", "ProductoGISolicitudId", "GI.tab_ProductoGISolicitud");
            DropForeignKey("GI.tab_ProductoGISolicitudArchivosFase", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("GI.tab_ProductoGISolicitudArchivosInnovacion", "ProductoGISolicitudId", "GI.tab_ProductoGISolicitud");
            DropForeignKey("GI.tab_ProductoGISolicitudArchivosInnovacion", "AdjuntoId", "GEN.Adjunto");
            DropForeignKey("GI.tab_ProductoGISolicitud", "ProductoId", "GI.tab_Producto");
            DropIndex("GI.tab_ProductoGISolicitudArchivosSuperior", new[] { "ProductoGISolicitudId" });
            DropIndex("GI.tab_ProductoGISolicitudArchivosSuperior", new[] { "AdjuntoId" });
            DropIndex("GI.tab_ProductoGISolicitudArchivosFase", new[] { "ProductoGISolicitudId" });
            DropIndex("GI.tab_ProductoGISolicitudArchivosFase", new[] { "AdjuntoId" });
            DropIndex("GI.tab_ProductoGISolicitudArchivosInnovacion", new[] { "ProductoGISolicitudId" });
            DropIndex("GI.tab_ProductoGISolicitudArchivosInnovacion", new[] { "AdjuntoId" });
            DropIndex("GI.tab_ProductoGISolicitud", new[] { "ProductoId" });
            DropTable("GI.tab_ProductoGISolicitudArchivosSuperior");
            DropTable("GI.tab_ProductoGISolicitudArchivosFase");
            DropTable("GI.tab_ProductoGISolicitudArchivosInnovacion");
            DropTable("GI.tab_ProductoGISolicitud");
        }
    }
}
