namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambiorelacionpi : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("PI.tab_AutoresIntDAPatrimonio", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
        
        public override void Down()
        {
            CreateIndex("PI.tab_AutoresIntDAPatrimonio", new[] { "ClaveUnidad", "FechaEfectiva" });
            AddForeignKey("PI.tab_AutoresIntDAPatrimonio", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
    }
}
