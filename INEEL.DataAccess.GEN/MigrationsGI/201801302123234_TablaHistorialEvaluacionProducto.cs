namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TablaHistorialEvaluacionProducto : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_ProductoHistorialFI",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ProductoId = c.Int(nullable: false),
                        SolicitudId = c.Int(nullable: false),
                        ComentarioGerencia = c.String(),
                        EvaluacionGerencia = c.String(),
                        FechaEvaluacionGerencia = c.DateTime(nullable: false),
                        ComentarioPreliminar = c.String(),
                        EvaluacionPreliminar = c.String(),
                        FechaEvaluacionPreliminar = c.DateTime(nullable: false),
                        ComentarioFinal = c.String(),
                        EvaluacionFinal = c.String(),
                        FechaEvaluacionFinal = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("GI.tab_Producto", t => t.ProductoId, cascadeDelete: false)
                .Index(t => t.ProductoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_ProductoHistorialFI", "ProductoId", "GI.tab_Producto");
            DropIndex("GI.tab_ProductoHistorialFI", new[] { "ProductoId" });
            DropTable("GI.tab_ProductoHistorialFI");
        }
    }
}
