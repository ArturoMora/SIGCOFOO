namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class areasconvenio2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_AreaConvenio", "ClaveUnidad", c => c.String(maxLength: 10));
            AddColumn("CR.tab_AreaConvenio", "FechaEfectiva", c => c.DateTime(nullable: false));
            CreateIndex("CR.tab_AreaConvenio", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("CR.tab_AreaConvenio", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_AreaConvenio", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("CR.tab_AreaConvenio", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropColumn("CR.tab_AreaConvenio", "FechaEfectiva");
            DropColumn("CR.tab_AreaConvenio", "ClaveUnidad");
        }
    }
}
