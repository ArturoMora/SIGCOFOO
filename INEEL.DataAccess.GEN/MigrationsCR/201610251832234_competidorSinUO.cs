namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class competidorSinUO : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_Competidor", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CR.tab_Competidor", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropColumn("CR.tab_Competidor", "ClaveUnidad");
            DropColumn("CR.tab_Competidor", "FechaEfectiva");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_Competidor", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("CR.tab_Competidor", "ClaveUnidad", c => c.String(maxLength: 10));
            CreateIndex("CR.tab_Competidor", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CR.tab_Competidor", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
    }
}
