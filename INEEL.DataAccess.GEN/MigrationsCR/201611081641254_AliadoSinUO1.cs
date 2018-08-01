namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AliadoSinUO1 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_AreaActividadAdicional", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CR.tab_AreaActividadAdicional", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropColumn("CR.tab_AreaActividadAdicional", "ClaveUnidad");
            DropColumn("CR.tab_AreaActividadAdicional", "FechaEfectiva");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_AreaActividadAdicional", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("CR.tab_AreaActividadAdicional", "ClaveUnidad", c => c.String(maxLength: 10));
            CreateIndex("CR.tab_AreaActividadAdicional", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CR.tab_AreaActividadAdicional", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
    }
}
