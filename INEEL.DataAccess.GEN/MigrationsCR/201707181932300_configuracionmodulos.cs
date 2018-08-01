namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class configuracionmodulos : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("CP.tab_Lineamientos", "AdjuntoId", "GEN.Adjunto");
            //DropForeignKey("CP.tab_Lineamientos", "idCP", "CP.tab_Comunidades");
            //DropForeignKey("CP.tab_Lineamientos", "IdTipoLineamiento", "CP.cat_TipoLineamiento");
            //DropIndex("CP.tab_Lineamientos", new[] { "AdjuntoId" });
            //DropIndex("CP.tab_Lineamientos", new[] { "IdTipoLineamiento" });
            //DropIndex("CP.tab_Lineamientos", new[] { "idCP" });
            //AddColumn("GEN.cat_Modulo", "Url", c => c.String());
            //AddColumn("GEN.cat_Modulo", "UrlImagen", c => c.String());
            //AddColumn("GEN.cat_Modulo", "Secuencia", c => c.Int(nullable: false));
            //DropTable("CP.tab_Lineamientos");
            //DropTable("CP.cat_TipoLineamiento");
        }
        
        public override void Down()
        {
        //    CreateTable(
        //        "CP.cat_TipoLineamiento",
        //        c => new
        //            {
        //                TipoLineamientoId = c.Int(nullable: false, identity: true),
        //                Nombre = c.String(),
        //                Descripcion = c.String(),
        //                FechaRegistro = c.DateTime(nullable: false),
        //                Autor = c.String(),
        //                Estado = c.Boolean(nullable: false),
        //            })
        //        .PrimaryKey(t => t.TipoLineamientoId);
            
        //    CreateTable(
        //        "CP.tab_Lineamientos",
        //        c => new
        //            {
        //                LineamientoId = c.Int(nullable: false, identity: true),
        //                Nombre = c.String(),
        //                FechaRegistro = c.DateTime(nullable: false),
        //                AdjuntoId = c.Long(),
        //                NombreAdjunto = c.String(),
        //                IdTipoLineamiento = c.Int(nullable: false),
        //                idCP = c.Int(nullable: false),
        //            })
        //        .PrimaryKey(t => t.LineamientoId);
            
        //    DropColumn("GEN.cat_Modulo", "Secuencia");
        //    DropColumn("GEN.cat_Modulo", "UrlImagen");
        //    DropColumn("GEN.cat_Modulo", "Url");
        //    CreateIndex("CP.tab_Lineamientos", "idCP");
        //    CreateIndex("CP.tab_Lineamientos", "IdTipoLineamiento");
        //    CreateIndex("CP.tab_Lineamientos", "AdjuntoId");
        //    AddForeignKey("CP.tab_Lineamientos", "IdTipoLineamiento", "CP.cat_TipoLineamiento", "TipoLineamientoId", cascadeDelete: true);
        //    AddForeignKey("CP.tab_Lineamientos", "idCP", "CP.tab_Comunidades", "ComunidadId", cascadeDelete: true);
        //    AddForeignKey("CP.tab_Lineamientos", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
    }
}
