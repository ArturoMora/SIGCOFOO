namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class quitandoRelaciones : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad");
            DropForeignKey("CH.cat_Asistentes", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropForeignKey("CH.tab_BecarioDirigido", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropForeignKey("CH.cat_EncargadoDespacho", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CH.cat_Asistentes", new[] { "ClaveUnidad", "FechaEfectiva" });
            //DropIndex("GEN.cat_UnidadOrganizacional", new[] { "tipoO" });
            DropIndex("CH.tab_BecarioDirigido", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropIndex("CH.cat_EncargadoDespacho", new[] { "ClaveUnidad", "FechaEfectiva" });
            //DropTable("GEN.cat_UnidadOrganizacional");
            //DropTable("GEN.cat_TipoUnidad");
        }
        
        public override void Down()
        {
            //CreateTable(
            //    "GEN.cat_TipoUnidad",
            //    c => new
            //        {
            //            TipoUnidadID = c.Int(nullable: false, identity: true),
            //            Descripcion = c.String(maxLength: 100),
            //            Estado = c.Int(nullable: false),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //        })
            //    .PrimaryKey(t => t.TipoUnidadID);
            
            //CreateTable(
            //    "GEN.cat_UnidadOrganizacional",
            //    c => new
            //        {
            //            ClaveUnidad = c.String(nullable: false, maxLength: 10),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //            NombreUnidad = c.String(maxLength: 200),
            //            tipoO = c.Int(nullable: false),
            //            padre = c.String(),
            //            ClaveResponsable = c.String(),
            //            Localizacion = c.String(maxLength: 100),
            //            Estado = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => new { t.ClaveUnidad, t.FechaEfectiva });
            
            CreateIndex("CH.cat_EncargadoDespacho", new[] { "ClaveUnidad", "FechaEfectiva" });
            CreateIndex("CH.tab_BecarioDirigido", new[] { "ClaveUnidad", "FechaEfectiva" });
            //CreateIndex("GEN.cat_UnidadOrganizacional", "tipoO");
            CreateIndex("CH.cat_Asistentes", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CH.cat_EncargadoDespacho", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CH.tab_BecarioDirigido", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CH.cat_Asistentes", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
            //AddForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad", "TipoUnidadID", cascadeDelete: true);
        }
    }
}
