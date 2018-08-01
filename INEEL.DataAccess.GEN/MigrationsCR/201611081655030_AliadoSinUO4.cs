namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AliadoSinUO4 : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad");
            DropForeignKey("CR.tab_AreaConvenio", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CR.tab_AreaConvenio", new[] { "ClaveUnidad", "FechaEfectiva" });
            //DropIndex("GEN.cat_UnidadOrganizacional", new[] { "tipoO" });
            DropColumn("CR.tab_AreaConvenio", "ClaveUnidad");
            DropColumn("CR.tab_AreaConvenio", "FechaEfectiva");
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
            
            AddColumn("CR.tab_AreaConvenio", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("CR.tab_AreaConvenio", "ClaveUnidad", c => c.String(maxLength: 10));
            //CreateIndex("GEN.cat_UnidadOrganizacional", "tipoO");
            CreateIndex("CR.tab_AreaConvenio", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CR.tab_AreaConvenio", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
            //AddForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad", "TipoUnidadID", cascadeDelete: true);
        }
    }
}
