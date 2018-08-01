namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class areasAdicionales : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_AreaActividadAdicional", "ClaveUnidad", c => c.String(maxLength: 10));
            AddColumn("CR.tab_AreaActividadAdicional", "FechaEfectiva", c => c.DateTime(nullable: false));
            CreateIndex("CR.tab_AreaActividadAdicional", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CR.tab_AreaActividadAdicional", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_AreaActividadAdicional", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CR.tab_AreaActividadAdicional", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropColumn("CR.tab_AreaActividadAdicional", "FechaEfectiva");
            DropColumn("CR.tab_AreaActividadAdicional", "ClaveUnidad");
        }
    }
}
