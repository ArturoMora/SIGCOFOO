namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class quitarllaveunidadorg : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("PI.tab_DerechosAutor", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropIndex("PI.tab_DerechosAutor", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" });
            DropColumn("PI.tab_DerechosAutor", "UnidadOrganizacional_ClaveUnidad");
            DropColumn("PI.tab_DerechosAutor", "UnidadOrganizacional_FechaEfectiva");
        }
        
        public override void Down()
        {
            AddColumn("PI.tab_DerechosAutor", "UnidadOrganizacional_FechaEfectiva", c => c.DateTime());
            AddColumn("PI.tab_DerechosAutor", "UnidadOrganizacional_ClaveUnidad", c => c.String(maxLength: 10));
            CreateIndex("PI.tab_DerechosAutor", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" });
            AddForeignKey("PI.tab_DerechosAutor", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
    }
}
